import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useBookSearch(query, pageNumber) {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setBooks([]);
	}, [query]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		/** The AbortController interface represents a controller
		 *  object that allows you to abort one or more Web
		 *  requests as and when desired.
		 */
		const controller = new AbortController();
		axios
			.get('http://openlibrary.org/search.json', {
				params: { q: query, page: pageNumber },
				signal: controller.signal,
			})
			.then((res) => {
				setBooks((prevBooks) => {
					return [
						...new Set([
							...prevBooks,
							...res.data.docs.map((b) => b.title),
						]),
					];
				});
				setHasMore(res.data.docs.length > 0);
				setLoading(false);
			})
			.catch((err) => {
				if (axios.isCancel(err)) return;
				setError(true);
			});
		return () => {
			controller.abort();
		};
	}, [query, pageNumber]);

	return { loading, error, books, hasMore };
}
