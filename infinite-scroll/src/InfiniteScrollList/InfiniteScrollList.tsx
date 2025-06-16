import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";

type InfiniteScrollListProps<T> = {
  items: T[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string,
  loader?: React.ReactNode;
  threshold?: number;
}

const InfiniteScrollList = <T,>(props: InfiniteScrollListProps<T>) => {
  const { items, hasMore, loadMore, isLoading, renderItem, className, loader = <div>Loading...</div>, threshold = 300 } = props;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if(entries[0].isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore])

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: `${threshold}px`,
    });
    
    const sentinel = sentinelRef.current;

    if(sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [onIntersect, threshold]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
      <div ref={sentinelRef} />
      {isLoading && loader}
    </div>
  )
};

export default InfiniteScrollList;
