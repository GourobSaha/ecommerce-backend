-- This file contains SQL queries for generating reports.

-- Total sales by month for the last 6 months
SELECT 
  TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
  ROUND(SUM("totalAmount"), 2) AS total_sales,
  COUNT(id) AS order_count
FROM "order"
WHERE "createdAt" >= NOW() - INTERVAL '6 months'
GROUP BY month
ORDER BY month DESC;

-- Top users by total spending
SELECT 
  u.id,
  u.name,
  COUNT(o.id) AS order_count,
  ROUND(SUM(o."totalAmount"), 2) AS total_spent
FROM "user" u
LEFT JOIN "order" o ON u.id = o."userId"
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;

-- Product performance report
SELECT 
  p.id,
  p.name,
  SUM(oi.quantity) AS units_sold,
  ROUND(SUM(oi.quantity * oi.price), 2) AS revenue
FROM "product" p
INNER JOIN "order_item" oi ON p.id = oi."productId"
GROUP BY p.id
ORDER BY revenue DESC
LIMIT 10;
