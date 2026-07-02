// SVG 线框碰撞检测：检查 line/polyline 线段是否穿越 rect（活动框/事件框）内部。
// 端点落在框边缘（连接/marker 进框）不算冲突；穿越内缩 4px 的内框才报。
(function () {
  var svg = document.querySelector('svg.diagram');
  if (!svg) return 'NO SVG';
  var rects = [];
  svg.querySelectorAll('rect').forEach(function (r) {
    var w = +r.getAttribute('width'), h = +r.getAttribute('height');
    var fill = r.getAttribute('fill') || '';
    // 跳过背景与容器（无填充、全幅、或虚线容器框）
    if (fill === 'none' || w > 900 || r.getAttribute('stroke-dasharray')) return;
    var rx = +r.getAttribute('x'), ry = +r.getAttribute('y');
    var lbl = r.parentElement.tagName.toLowerCase() === 'a'
      ? (r.parentElement.textContent || '').trim().slice(0, 12)
      : (r.nextElementSibling && r.nextElementSibling.tagName === 'text' ? r.nextElementSibling.textContent.trim().slice(0, 12) : fill + '@' + rx + ',' + ry);
    rects.push({
      x: rx + 4, y: ry + 4, X: rx + w - 4, Y: ry + h - 4,
      cx: rx + w / 2, cy: ry + h / 2, small: h < 40,
      label: lbl
    });
  });
  var segs = [];
  svg.querySelectorAll('line').forEach(function (l) {
    segs.push({ x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'), x2: +l.getAttribute('x2'), y2: +l.getAttribute('y2') });
  });
  svg.querySelectorAll('polyline').forEach(function (p) {
    var pts = p.getAttribute('points').trim().split(/[\s,]+/).map(Number);
    for (var i = 0; i + 3 < pts.length; i += 2)
      segs.push({ x1: pts[i], y1: pts[i + 1], x2: pts[i + 2], y2: pts[i + 3] });
  });
  // 端点在框边缘环带（±8）= 合法连接（marker 进框）；端点深入框体内部 = 违规
  function nearBox(px, py, b, tol) {
    return px >= b.x - tol && px <= b.X + tol && py >= b.y - tol && py <= b.Y + tol;
  }
  function inCore(px, py, b) { // 深入内部（内框再缩 4）
    return px > b.x + 4 && px < b.X - 4 && py > b.y + 4 && py < b.Y - 4;
  }
  function onEdge(px, py, b) { return nearBox(px, py, b, 8) && !inCore(px, py, b); }
  var hits = [];
  segs.forEach(function (s) {
    rects.forEach(function (b) {
      // 仅处理水平/垂直线段（本图全部直角线）
      if (s.y1 === s.y2) { // 水平
        var y = s.y1, lo = Math.min(s.x1, s.x2), hi = Math.max(s.x1, s.x2);
        if (y > b.y && y < b.Y && hi > b.x && lo < b.X) {
          if (b.small && Math.abs(y - b.cy) <= 6) return; // 事件框正中挂线：合法
          if (inCore(s.x1, s.y1, b) || inCore(s.x2, s.y2, b))
            hits.push('横线 y=' + y + ' 端点陷入 [' + b.label + '] 内部');
          else if (!onEdge(s.x1, s.y1, b) && !onEdge(s.x2, s.y2, b))
            hits.push('横线 y=' + y + ' (x ' + lo + '..' + hi + ') 穿 [' + b.label + ']');
        }
      } else if (s.x1 === s.x2) { // 垂直
        var x = s.x1, lo2 = Math.min(s.y1, s.y2), hi2 = Math.max(s.y1, s.y2);
        if (x > b.x && x < b.X && hi2 > b.y && lo2 < b.Y) {
          if (b.small && Math.abs(x - b.cx) <= 6) return; // 事件框正中挂线：合法
          if (inCore(s.x1, s.y1, b) || inCore(s.x2, s.y2, b))
            hits.push('竖线 x=' + x + ' 端点陷入 [' + b.label + '] 内部');
          else if (!onEdge(s.x1, s.y1, b) && !onEdge(s.x2, s.y2, b))
            hits.push('竖线 x=' + x + ' (y ' + lo2 + '..' + hi2 + ') 穿 [' + b.label + ']');
        }
      }
    });
  });
  return hits.length ? ('发现 ' + hits.length + ' 处遮挡:\n' + hits.join('\n')) : ('OK: ' + segs.length + ' 段线 × ' + rects.length + ' 框, 零遮挡');
})();
