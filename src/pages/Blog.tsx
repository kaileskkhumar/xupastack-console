import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { blogPosts } from "@/data/blog-posts";
import { ArrowRight } from "lucide-react";

const Blog = () => (
  <Layout>
    <div className="section-container py-16 md:py-24 max-w-4xl">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">Practical guides, deep dives, and troubleshooting tips.</p>
      </AnimatedSection>

      <div className="space-y-4">
        {blogPosts.map((post, i) => (
          <AnimatedSection key={post.slug} delay={i * 0.04}>
            <Link
              to={`/blog/${post.slug}`}
              className="surface-elevated rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 group transition-shadow duration-300 block"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </Layout>
);

export default Blog;
