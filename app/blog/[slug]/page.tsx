import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { requireAdminSession } from "@/lib/adminSession";

export default async function BlogPostPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const wantsPreview = sp.preview === "1" || sp.preview === "true";
  const isAdmin = wantsPreview ? requireAdminSession() : false;

  const post = await prisma.post.findFirst({
    where: {
        slug,
        ...(isAdmin ? {} : { isPublished: true }),
    }
  });

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <header className="space-y-2">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ BLOG ]
        </div>
        <h1 className="text-4xl font-bold text-[var(--color-fg)]">{post.title}</h1>
        {post.publishedAt ? (
          <div className="text-sm text-[var(--color-fg)]/60">
            {new Date(post.publishedAt).toLocaleString("en-GB")}
          </div>
        ) : (
            <span>Draft</span>
        )}

        {isAdmin && !post.isPublished ? (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-[var(--analog-amber)] text-[var(--analog-amber)] bg-[var(--analog-amber)]/10">
                PREVIEW
            </span>
        ): null}
      </header>

      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      ) : null}

      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children, ...props }) => (
              <h2
                {...props}
                className="mt-8 first:mt-0 text-3xl font-bold tracking-tight text-[var(--color-fg)]"
              >
                {children}
              </h2>
            ),
            h2: ({ children, ...props }) => (
              <h3
                {...props}
                className="mt-6 text-2xl font-bold tracking-tight text-[var(--color-fg)]"
              >
                {children}
              </h3>
            ),
            h3: ({ children, ...props }) => (
              <h4
                {...props}
                className="mt-5 text-xl font-bold text-[var(--color-fg)]"
              >
                {children}
              </h4>
            ),
            p: ({ children, ...props }) => (
              <p {...props} className="mt-4 leading-7 text-[var(--color-fg)]/85">
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul
                {...props}
                className="mt-4 list-disc pl-6 space-y-2 text-[var(--color-fg)]/85"
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                {...props}
                className="mt-4 list-decimal pl-6 space-y-2 text-[var(--color-fg)]/85"
              >
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li {...props} className="leading-7">
                {children}
              </li>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote
                {...props}
                className="mt-4 border-l-2 border-[var(--digital-cyan)] pl-4 text-[var(--color-fg)]/80 italic"
              >
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...props }) => {
              const isBlock = Boolean(className);
              if (isBlock) {
                return (
                  <code
                    {...props}
                    className={[
                      "block mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)]",
                      "bg-[var(--color-surface-2)]/40 p-4 text-xs text-[var(--color-fg)]",
                      className ?? "",
                    ].join(" ")}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code
                  {...props}
                  className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-1.5 py-0.5 text-[0.85em] text-[var(--digital-cyan)]"
                >
                  {children}
                </code>
              );
            },
            a: ({ children, ...props }) => (
              <a
                {...props}
                className="text-[var(--digital-cyan)] hover:underline underline-offset-4"
                target={props.href?.startsWith("http") ? "_blank" : undefined}
                rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
              >
                {children}
              </a>
            ),
            hr: (props) => (
              <hr {...props} className="my-8 border-[var(--color-border)]" />
            ),
            img: ({ ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                {...props}
                className="mt-4 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                alt={props.alt ?? ""}
              />
            ),
            table: ({ children, ...props }) => (
                <div className="mt-6 overflow-x-auto">
                    <table
                        {...props}
                        className="w-full border border-[var(--color-border)] text-sm">
                        {children}
                    </table>
                </div>
            ),
            thead: ({ children, ...props }) => (
                <thead {...props} className="bg-[var(--color-surface-2)]/40">
                    {children}
                </thead>
            ),
            th: ({ children, ...props }) => (
                <th
                    {...props}
                    className="border-b border-[var(--color-border)] px-3 py-2 text-left font-bold text-[var(--color-fg)]">
                    {children}
                </th>
            ),
            td: ({ children, ...props }) => (
                <td {...props} className="border-t border-[var(--color-border)] px-3 py-2">
                    {children}
                </td>
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

export const dynamic = "force-dynamic";