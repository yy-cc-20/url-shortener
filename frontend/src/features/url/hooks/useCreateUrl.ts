// import { useState } from 'react';
// import type { CreateUrlRequest } from '../../../../../libs/types/url';
// import { createUrl } from '../api';

// export function useCreateUrl() {
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const submit = async (data: CreateUrlRequest) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await createUrl(data);
//       setResult(res.short_url);
//     } catch (caughtError) {
//       setResult(null);
//       setError(
//         caughtError instanceof Error
//           ? caughtError.message
//           : 'Unable to create short URL',
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { submit, result, error, isLoading };
// }
