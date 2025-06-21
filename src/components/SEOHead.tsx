
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "Exquisite Corpse - Collaborative Storytelling",
  description = "Create amazing collaborative stories with friends, family, or colleagues. Each person adds one sentence to build a unique narrative together.",
  image = "/placeholder.svg",
  url = window.location.href,
  type = "website"
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags */}
      <meta name="author" content="Exquisite Corpse" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead;
