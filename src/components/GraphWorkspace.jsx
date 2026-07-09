import React, { memo, useEffect, useRef, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Plus, Trash2, RotateCcw } from 'lucide-react';
import { compileExpr } from '../graph/expr-parser.js';
import { renderGraph, panView, zoomView, screenToWorld } from '../graph/graph-renderer.js';
import { createGraphExpression, DEFAULT_VIEW, GRAPH_COLORS } from '../graph/graph-boards.js';

function GraphPlotCanvas({ view, curves, onViewChange }) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderGraph(canvas, { view, curves });
  }, [view, curves]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ro = new ResizeObserver(() => redraw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [redraw]);

  const handlePointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, view };
  }, [view]);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    const nextView = panView(dragRef.current.view, dx, dy, rect.width, rect.height);
    dragRef.current.view = nextView;
    onViewChange(nextView);
  }, [onViewChange]);

  const handlePointerUp = useCallback((e) => {
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture?.(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const world = screenToWorld(px, py, view, rect.width, rect.height);
    const factor = e.deltaY > 0 ? 1.12 : 1 / 1.12;
    onViewChange(zoomView(view, factor, world.x, world.y));
  }, [view, onViewChange]);

  return (
    <canvas
      ref={canvasRef}
      className="graph-plot-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    />
  );
}

function GraphExprRow({
  expression,
  index,
  error,
  onChangeExpr,
  onToggleVisible,
  onDelete,
  canDelete,
}) {
  return (
    <div className={`graph-expr-row${error ? ' has-error' : ''}`}>
      <button
        type="button"
        className="graph-expr-color"
        style={{ '--expr-color': expression.color }}
        title={expression.visible ? '隐藏' : '显示'}
        onClick={onToggleVisible}
      >
        {expression.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <span className="graph-expr-prefix">y =</span>
      <input
        className="graph-expr-input"
        value={expression.expr}
        onChange={(e) => onChangeExpr(e.target.value)}
        placeholder="sin(x)"
        spellCheck={false}
        aria-label={`函数 ${index + 1}`}
      />
      <button
        type="button"
        className="graph-expr-delete"
        onClick={onDelete}
        disabled={!canDelete}
        title="删除函数"
      >
        <Trash2 size={13} />
      </button>
      {error ? <div className="graph-expr-error">{error}</div> : null}
    </div>
  );
}

function GraphWorkspace({ board, onChange }) {
  const compiled = useMemo(() => (
    board.expressions.map((expr) => {
      const result = compileExpr(expr.expr);
      return {
        id: expr.id,
        color: expr.color,
        visible: expr.visible,
        ...result,
      };
    })
  ), [board.expressions]);

  const curves = useMemo(() => (
    compiled
      .filter((c) => c.ok && c.visible && !c.empty)
      .map((c) => ({ eval: c.eval, color: c.color, visible: true }))
  ), [compiled]);

  const updateExpressions = useCallback((nextExpressions) => {
    onChange({
      ...board,
      expressions: nextExpressions,
      updatedAt: new Date().toISOString(),
    });
  }, [board, onChange]);

  const handleExprChange = useCallback((id, value) => {
    updateExpressions(board.expressions.map((e) => (
      e.id === id ? { ...e, expr: value } : e
    )));
  }, [board.expressions, updateExpressions]);

  const handleToggleVisible = useCallback((id) => {
    updateExpressions(board.expressions.map((e) => (
      e.id === id ? { ...e, visible: !e.visible } : e
    )));
  }, [board.expressions, updateExpressions]);

  const handleDeleteExpr = useCallback((id) => {
    if (board.expressions.length <= 1) return;
    updateExpressions(board.expressions.filter((e) => e.id !== id));
  }, [board.expressions, updateExpressions]);

  const handleAddExpr = useCallback(() => {
    const next = createGraphExpression(
      { expr: '', color: GRAPH_COLORS[board.expressions.length % GRAPH_COLORS.length] },
      board.expressions.length,
    );
    updateExpressions([...board.expressions, next]);
  }, [board.expressions, updateExpressions]);

  const handleViewChange = useCallback((view) => {
    onChange({
      ...board,
      view,
      updatedAt: new Date().toISOString(),
    });
  }, [board, onChange]);

  const handleResetView = useCallback(() => {
    handleViewChange({ ...DEFAULT_VIEW });
  }, [handleViewChange]);

  return (
    <div className="graph-workspace">
      <div className="graph-expr-panel">
        <div className="graph-expr-panel-header">
          <span>函数</span>
          <button type="button" className="graph-expr-add" onClick={handleAddExpr} title="添加函数">
            <Plus size={14} />
            <span>添加</span>
          </button>
        </div>
        <div className="graph-expr-list">
          {board.expressions.map((expr, index) => (
            <GraphExprRow
              key={expr.id}
              expression={expr}
              index={index}
              error={compiled[index]?.ok === false ? compiled[index].error : null}
              onChangeExpr={(value) => handleExprChange(expr.id, value)}
              onToggleVisible={() => handleToggleVisible(expr.id)}
              onDelete={() => handleDeleteExpr(expr.id)}
              canDelete={board.expressions.length > 1}
            />
          ))}
        </div>
        <div className="graph-expr-hint">
          支持 sin cos tan sqrt abs ln exp ^ 等 · 拖拽平移 · 滚轮缩放
        </div>
      </div>
      <div className="graph-plot-panel">
        <div className="graph-plot-toolbar">
          <span className="graph-plot-label">图像</span>
          <button type="button" className="btn" onClick={handleResetView} title="重置视图">
            <RotateCcw size={13} />
            <span>重置视图</span>
          </button>
        </div>
        <div className="graph-plot-wrap">
          <GraphPlotCanvas
            view={board.view}
            curves={curves}
            onViewChange={handleViewChange}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(GraphWorkspace);
