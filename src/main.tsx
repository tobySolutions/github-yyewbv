import React, { useRef, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { block, For } from 'million/react';

import './index.css';

import { useVirtualizer } from '@tanstack/react-virtual';

function App() {
  return (
    <div>
      <p>
        These components are using <strong>fixed</strong> sizes. This means that
        every element's dimensions are hard-coded to the same value and never
        change.
      </p>
      <GridVirtualizerFixed />
      {process.env.NODE_ENV === 'development' ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Rendering performance will be slightly degraded
          until this application is build for production.
        </p>
      ) : null}
    </div>
  );
}

function GridVirtualizerFixed() {
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div>
      <br />
      <h3>Grid With React DOM</h3>
      <GridDisplay
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        columnVirtualizer={columnVirtualizer}
      />
      <br />
      <h3>Grid With Million DOM</h3>
      <MillionGridDisplay
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        columnVirtualizer={columnVirtualizer}
      />
    </div>
  );
}

function GridDisplay({ parentRef, rowVirtualizer, columnVirtualizer }) {
  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `500px`,
          width: `500px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Fragment key={virtualRow.index}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.index}
                  className={
                    virtualColumn.index % 2
                      ? virtualRow.index % 2 === 0
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                      : virtualRow.index % 2
                      ? 'ListItemOdd'
                      : 'ListItemEven'
                  }
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  Cell {virtualRow.index}, {virtualColumn.index}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

function MillionGridDisplay({ parentRef, rowVirtualizer, columnVirtualizer }) {
  return (
    <div
      ref={parentRef}
      className="List"
      style={{
        height: `500px`,
        width: `500px`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        <For each={rowVirtualizer.getVirtualItems()}>
          {(virtualRow) => (
            <Fragment key={virtualRow.index}>
              <For each={columnVirtualizer.getVirtualItems()}>
                {(virtualColumn) => (
                  <CellBlock
                    virtualColumn={virtualColumn}
                    virtualRow={virtualRow}
                  />
                )}
              </For>
            </Fragment>
          )}
        </For>
      </div>
    </div>
  );
}

const CellBlock = block(Cell);

function Cell({ virtualColumn, virtualRow }) {
  return (
    <div
      key={virtualColumn.index}
      className={
        virtualColumn.index % 2
          ? virtualRow.index % 2 === 0
            ? 'ListItemOdd'
            : 'ListItemEven'
          : virtualRow.index % 2
          ? 'ListItemOdd'
          : 'ListItemEven'
      }
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${virtualColumn.size}px`,
        height: `${virtualRow.size}px`,
        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
      }}
    >
      Cell {virtualRow.index}, {virtualColumn.index}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
