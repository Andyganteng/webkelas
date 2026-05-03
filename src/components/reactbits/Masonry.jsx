import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

function Masonry({ data, maxColumns = 3 }) {
  const [columns, setColumns] = useState(maxColumns);
  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (width > 1024) setColumns(maxColumns);
    else if (width > 640) setColumns(Math.max(2, maxColumns - 1));
    else setColumns(1);
  }, [width, maxColumns]);

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0);
    let gridItems = data.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columns) * column;
      const y = (heights[column] += child.height / 2) - child.height / 2;
      return { ...child, x, y, width: width / columns, height: child.height / 2 };
    });
    return [heights, gridItems];
  }, [columns, data, width]);

  const transitions = useTransition(gridItems, {
    key: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div ref={ref} style={{ height: Math.max(...heights), position: 'relative', width: '100%' }}>
      {transitions((style, item) => (
        <a.div style={{ ...style, position: 'absolute' }}>
          <div className="p-2 w-full h-full">
            <div
              className="w-full h-full rounded-2xl bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
          </div>
        </a.div>
      ))}
    </div>
  );
}

export default Masonry;
