
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  downloadLink: string;
  liveLink?: string;
}

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Sales Analytics Dashboard",
    description: "Comprehensive sales performance analysis with interactive visualizations, trend forecasting, and KPI tracking. Built to identify revenue patterns and optimization opportunities.",
    techStack: ["Python", "Pandas", "Plotly", "Dash"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  },
  {
    id: 2,
    title: "Customer Segmentation Analysis",
    description: "Machine learning-powered customer segmentation using RFM analysis and clustering algorithms to identify high-value customer segments and improve marketing strategies.",
    techStack: ["Python", "Scikit-learn", "Matplotlib", "Seaborn"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  },
  {
    id: 3,
    title: "Financial Performance Report",
    description: "Automated financial reporting system with Power BI integration, featuring real-time budget tracking, variance analysis, and executive-level financial summaries.",
    techStack: ["Power BI", "SQL", "Excel", "DAX"],
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  },
  {
    id: 4,
    title: "Market Trend Analysis",
    description: "Time series analysis of market trends with predictive modeling, sentiment analysis from social media data, and competitive landscape insights.",
    techStack: ["R", "ggplot2", "Time Series", "Tableau"],
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  },
  {
    id: 5,
    title: "Inventory Optimization Model",
    description: "Data-driven inventory management system using demand forecasting, ABC analysis, and supply chain optimization to reduce costs and improve efficiency.",
    techStack: ["Python", "NumPy", "SciPy", "Jupyter"],
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  },
  {
    id: 6,
    title: "HR Analytics Platform",
    description: "Employee performance analytics with attrition prediction, compensation analysis, and workforce planning insights to support strategic HR decisions.",
    techStack: ["Python", "Pandas", "Power BI", "SQL"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    downloadLink: "https://drive.google.com/file/d/your-file-id/view"
  }
];
