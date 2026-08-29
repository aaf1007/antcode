import { useEffect, useState } from 'react';
import './App.css';
import type { ProblemPagination, ProblemSnippet } from './types.ts';

function App() {
  const [problems, setProblems] = useState<ProblemSnippet[]>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const BASE_URL = "http://localhost:5001/api/";

  async function fetchAllProblems(): Promise<ProblemPagination> {
    const url = BASE_URL + "problem";
    const data = await fetch(url, {
      method: "GET",
    });

    if (!data.ok) {
      const body = await data.json().catch(() => null);
      throw new Error(`${data.status}: ${body?.error ?? "Request Failed"}`)
    }

    return data.json();
  };

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllProblems();
      setHasMore(data.hasMore);
      setProblems(data.problems);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("Unknown Error Occured"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadProblems = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllProblems();
        setHasMore(data.hasMore);
        setProblems(data.problems);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Unknown Error Occured"));
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (hasMore) {
      loadProblems();
    }
  }, []);

  return (
    <div>
      <button onClick={() => loadProblems()}>Get More Probems</button>
      {problems?.map(cur => (
        <li key={cur.questionId}>
          {cur.title}
          {error && <p>{error.message}</p>}
          {isLoading && <p>Loading...</p>}
        </li>
      ))}
    </div>
  );
}

export default App
