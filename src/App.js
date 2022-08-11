import useBookSearch from './useBookSearch';
import { useState, useRef } from 'react';
import { useCallback } from 'react';

function App() {
	const [query, setQuery] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const { loading, hasMore, books, error } = useBookSearch(query, pageNumber);

	const observer = useRef();

	const lastBookElementRef = useCallback(
		(node) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevNumber) => prevNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore]
	);

	const handleSearch = (e) => {
		setQuery(e.target.value);
	};

	return (
		<>
			<input type="text" value={query} onChange={handleSearch} />
			{books.map((el, index) => {
				if (books.length === index + 1)
					return (
						<div ref={lastBookElementRef} key={el}>
							{el}
						</div>
					);
				return <div key={el}>{el}</div>;
			})}
			{loading && <div>...Loading</div>}
			{error && <div>Error</div>}
		</>
	);
}

export default App;
