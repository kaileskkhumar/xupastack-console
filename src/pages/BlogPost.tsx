import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { blogPosts } from "@/data/blog-posts";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <div className="section-container py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-3">Post not found</h1>
          <Link to="/blog" className="text-sm text-primary hover:underline">Back to blog</Link>
        </div>
      </Layout>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const blocks = content.split("\n\n");
    return blocks.map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{block.slice(3)}</h2>;
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{block.slice(4)}</h3>;
      }
      if (block.startsWith("```")) {
        const lines = block.split("\n");
        const lang = lines[0].replace("```", "");
        const code = lines.slice(1, -1).join("\n");
        return <div key={i} className="my-4"><CodeBlock code={code} language={lang} /></div>;
      }
      if (block.startsWith("| ")) {
        const rows = block.split("\n").filter((r) => !r.startsWith("|--"));
        const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim());
        const dataRows = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        return (
          <div key={i} className="my-4 surface-elevated rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {headers?.map((h, j) => <th key={j} className="text-left p-3 font-medium text-muted-foreground">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => (
                  <tr key={ri} className="border-b border-border last:border-0">
                    {row.map((cell, ci) => <td key={ci} className="p-3 text-foreground">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-muted-foreground text-sm my-3">
            {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
          </ul>
        );
      }
      // Regular paragraph — handle inline code
      const parts = block.split(/(`[^`]+`)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed my-3 text-sm">
          {parts.map((part, j) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code key={j} className="code-block px-1.5 py-0.5 text-xs">{part.slice(1, -1)}</code>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <Layout>
      <article className="section-container py-16 md:py-24 max-w-3xl">
        <AnimatedSection>
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{post.category}</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <span className="text-xs text-muted-foreground">· {post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.description}</p>

          <div className="border-t border-border pt-8">
            {renderContent(post.content)}
          </div>
        </AnimatedSection>
      </article>
    </Layout>
  );
};

export default BlogPost;
