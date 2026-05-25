// import type {
//   CreateUrlRequest,
//   CreateUrlResponse,
// } from '../../../../libs/types/url';

// export async function createUrl(
//   data: CreateUrlRequest,
// ): Promise<CreateUrlResponse> {
//   const res = await fetch('/url', {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const payload: unknown = await res.json().catch(() => null);

//   if (!res.ok) {
//     throw new Error(getErrorMessage(payload) ?? 'Unable to create short URL');
//   }

//   return payload as CreateUrlResponse;
// }

// function getErrorMessage(payload: unknown): string | undefined {
//   if (!payload || typeof payload !== 'object' || !('message' in payload)) {
//     return undefined;
//   }

//   const message = payload.message;

//   if (typeof message === 'string') {
//     return message;
//   }

//   if (Array.isArray(message)) {
//     return message.filter((item) => typeof item === 'string').join(', ');
//   }

//   return undefined;
// }
