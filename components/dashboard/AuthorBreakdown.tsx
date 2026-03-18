'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AuthorStats } from '@/lib/types';

type AuthorBreakdownProps = {
  authors: AuthorStats[];
};

export function AuthorBreakdown({ authors }: AuthorBreakdownProps) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Activity by Author</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Author</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Commits</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Additions</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Deletions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr
                  key={author.author}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-medium text-sm">
                        {author.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {author.author}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">
                    {author.commits}
                  </td>
                  <td className="text-right py-3 px-2 text-green-600 dark:text-green-400 font-medium">
                    +{author.additions.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-2 text-red-600 dark:text-red-400 font-medium">
                    -{author.deletions.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
