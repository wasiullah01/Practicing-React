export type OrderStatus = 'Completed' | 'Processing' | 'Refunded'
export type Order = {
  id: string
  customer: string
  email: string
  initials: string
  color: string
  product: string
  date: string
  amount: number
  status: OrderStatus
}

const customers = [
  ['Olivia Rhye', 'olivia.rhye@gmail.com', 'OR', '#fce4d9'],
  ['Phoenix Baker', 'phoenix.baker@yahoo.com', 'PB', '#e4e6fb'],
  ['Lana Steiner', 'lana.steiner@outlook.com', 'LS', '#e2f0e9'],
  ['Demi Wilkinson', 'demi.wilkinson@gmail.com', 'DW', '#f9e3ed'],
  ['Candice Wu', 'candice.wu@icloud.com', 'CW', '#f5ead6'],
  ['Natali Craig', 'natali.craig@gmail.com', 'NC', '#dcecf4'],
  ['Drew Cano', 'drew.cano@yahoo.com', 'DC', '#ece4fa'],
  ['Andi Lane', 'andi.lane@outlook.com', 'AL', '#e5eee0'],
  ['Kate Morrison', 'kate.morrison@gmail.com', 'KM', '#f6e5dd'],
  ['Orlando Diggs', 'orlando.diggs@yahoo.com', 'OD', '#e0e9f8'],
] as const

const products = [
  ['Canvas Weekender', 148],
  ['Everyday Tote', 68],
  ['Ceramic Pour-over Set', 92],
  ['Linen Table Runner', 54],
  ['Minimalist Desk Lamp', 124],
  ['Ribbed Glass Set', 42],
  ['Woven Storage Basket', 76],
  ['Cloud Knit Throw', 112],
] as const

const statuses: OrderStatus[] = ['Completed', 'Completed', 'Completed', 'Processing', 'Refunded']
const colors = customers.map((customer) => customer[3])
const generatedAt = new Date()
const dataStartsAt = new Date(generatedAt.getFullYear(), generatedAt.getMonth() - 11, 1)
const dataDuration = generatedAt.getTime() - dataStartsAt.getTime()

export const orders: Order[] = Array.from({ length: 5000 }, (_, index) => {
  const customerIndex = (index * 7 + Math.floor(index / 4)) % customers.length
  const productIndex = (index * 3 + Math.floor(index / 11)) % products.length
  const customer = customers[customerIndex]
  const product = products[productIndex]
  const date = new Date(generatedAt.getTime() - (index * dataDuration) / 5000)
  return {
    id: `#FM-${String(5200 + index).padStart(5, '0')}`,
    customer: customer[0],
    email: customer[1],
    initials: customer[2],
    color: colors[customerIndex],
    product: product[0],
    date: [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-'),
    amount: product[1] + ((index * 17) % 140),
    status: statuses[(index * 13 + Math.floor(index / 7)) % statuses.length],
  }
})

export const totalRevenue = orders.reduce((total, order) => total + order.amount, 0)
export const averageOrderValue = totalRevenue / orders.length
export const orderDataGeneratedAt = generatedAt

export const topProducts = [
  { name: 'Canvas Weekender', category: 'Accessories', sold: 842, revenue: 124616, share: 82, color: 'bg-violet-500' },
  { name: 'Ceramic Pour-over Set', category: 'Home & Living', sold: 638, revenue: 58696, share: 65, color: 'bg-rose-400' },
  { name: 'Minimalist Desk Lamp', category: 'Home & Living', sold: 512, revenue: 63488, share: 53, color: 'bg-amber-400' },
  { name: 'Cloud Knit Throw', category: 'Textiles', sold: 406, revenue: 45472, share: 42, color: 'bg-sky-400' },
]
