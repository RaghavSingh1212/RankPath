// components/CollegeList.tsx
"use client";
import { useState } from 'react';

const CollegeList = () => {
  const [rank, setRank] = useState<number>(0);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchColleges = async () => {
    if (rank <= 0) {
      setError('Please enter a valid rank.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/collegelist?rank=${rank}`);
      const data = await response.json();

      if (data.colleges) {
        setColleges(data.colleges);
      } else {
        setError('No colleges found for the given rank.');
      }
    } catch (err) {
      setError('Error fetching colleges.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={rank}
        onChange={(e) => setRank(parseInt(e.target.value))}
        placeholder="Enter Closing Rank"
      />
      <button onClick={handleFetchColleges}>Fetch Colleges</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {colleges.map((college, index) => (
          <li key={index}>
            {college.Institute} : {college['Academic Program Name']}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollegeList;  // Default export
