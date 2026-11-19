export const mockUsers = [
  {
    id: "usr-101",
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+92 300 1234567",
    joinedDate: "Jan 15, 2024",
    bio: "Lead frontend architect specializing in React, state management, and modern design systems."
  },
  {
    id: "usr-102",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    role: "Editor",
    status: "Active",
    department: "Content & Marketing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+92 321 9876543",
    joinedDate: "Mar 04, 2024",
    bio: "Senior technical content strategist passionate about developer documentation."
  },
  {
    id: "usr-103",
    name: "Zainab Fatima",
    email: "zainab.f@example.com",
    role: "Viewer",
    status: "Pending",
    department: "Quality Assurance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+92 333 4567890",
    joinedDate: "Jun 18, 2024",
    bio: "Software quality engineer focused on end-to-end automated testing."
  },
  {
    id: "usr-104",
    name: "Hamza Malik",
    email: "hamza.m@example.com",
    role: "Admin",
    status: "Inactive",
    department: "Security & DevOps",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+92 312 3456789",
    joinedDate: "Nov 02, 2023",
    bio: "Infrastructure and cloud security specialist managing Kubernetes clusters."
  },
  {
    id: "usr-105",
    name: "Sara Ali",
    email: "sara.ali@example.com",
    role: "Editor",
    status: "Active",
    department: "Design & UX",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+92 345 6789012",
    joinedDate: "Apr 22, 2024",
    bio: "UI/UX researcher designing user-friendly micro-interactions and dashboards."
  },
  {
    id: "usr-106",
    name: "Omar Farooq",
    email: "omar.f@example.com",
    role: "Viewer",
    status: "Active",
    department: "Product Management",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    phone: "+92 301 2345678",
    joinedDate: "Aug 10, 2024",
    bio: "Product owner coordinating sprint plans and stakeholder feature roadmaps."
  }
];

export const mockProducts = [
  {
    id: "prod-201",
    name: "Apex Gaming Laptop Pro",
    category: "Laptops",
    price: 1899,
    stock: 24,
    status: "In Stock",
    rating: 4.8,
    sku: "LAP-APX-01",
    description: "Equipped with high-performance cooling, RTX 4080 graphics, and 240Hz OLED display.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-202",
    name: "ErgoFlow Wireless Mouse",
    category: "Accessories",
    price: 79,
    stock: 142,
    status: "In Stock",
    rating: 4.6,
    sku: "ACC-MOU-02",
    description: "Designed for all-day comfort with silent magnetic switches and dual Bluetooth channels.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-203",
    name: "Zenith Mechanical Keyboard 75%",
    category: "Accessories",
    price: 149,
    stock: 0,
    status: "Out of Stock",
    rating: 4.9,
    sku: "ACC-KEY-03",
    description: "Hot-swappable tactile switches with custom sound dampening foam and RGB backlighting.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-204",
    name: "UltraVision 34-inch Curved Display",
    category: "Monitors",
    price: 649,
    stock: 8,
    status: "Low Stock",
    rating: 4.7,
    sku: "MON-CUR-04",
    description: "WQHD 3440x1440 curved IPS panel with USB-C 90W power delivery and color calibration.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-205",
    name: "SonicShield Noise-Canceling Headset",
    category: "Audio",
    price: 299,
    stock: 35,
    status: "In Stock",
    rating: 4.5,
    sku: "AUD-HED-05",
    description: "Hybrid active noise cancellation with 45-hour battery life and spatial audio support.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
  }
];

export const mockDashboardStats = {
  totalUsers: 1420,
  activeProjects: 38,
  revenue: "$48,920",
  growthRate: "+14.6%",
  recentOrders: [
    { id: "ORD-991", customer: "Ayesha Khan", product: "Apex Gaming Laptop Pro", amount: "$1,899", status: "Completed" },
    { id: "ORD-992", customer: "Bilal Ahmed", product: "ErgoFlow Wireless Mouse", amount: "$79", status: "Processing" },
    { id: "ORD-993", customer: "Sara Ali", product: "Zenith Mechanical Keyboard", amount: "$149", status: "Completed" },
    { id: "ORD-994", customer: "Omar Farooq", product: "UltraVision 34-inch Display", amount: "$649", status: "Shipped" }
  ]
};
