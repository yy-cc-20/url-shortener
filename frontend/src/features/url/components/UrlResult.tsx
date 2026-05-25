interface UrlResultProps {
  shortUrl: string;
}

export function UrlResult({ shortUrl }: UrlResultProps) {
  return (
    <p>
      Short URL: <code>{shortUrl}</code>
    </p>
  );
}
