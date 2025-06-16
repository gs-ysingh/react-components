import { useEffect, useState } from "react";
import InfiniteScrollList from "./InfiniteScrollList/InfiniteScrollList";

type Item = {
  id: number;
  name: string;
};

const fetchItems = async (page: number): Promise<Item[]> => {
  await new Promise((res) => setTimeout(res, 1000)); // simulate network
  return Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i,
    name: `Item ${page * 10 + i}`,
  }));
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    const newItems = await fetchItems(page);
    setItems((prev) => [...prev, ...newItems]);
    setPage((p) => p + 1);
    if (newItems.length < 10) setHasMore(false);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="App">
      <h1>Basic Infinite Scroll</h1>
      <InfiniteScrollList
        items={items}
        hasMore={hasMore}
        isLoading={isLoading}
        loadMore={loadMore}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
      />
    </div>
  );
}
