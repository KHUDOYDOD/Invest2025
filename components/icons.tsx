import {
  Users,
  DollarSign,
  CreditCard,
  LineChart,
  Home,
  Settings,
  Bell,
  MessageSquare,
  User,
  FileText,
  BarChart2,
  Lock,
  Mail,
  Shield,
  Briefcase,
  TrendingUp,
  Activity,
  PieChart,
  RefreshCw,
  Globe,
  Database,
  Layers,
  Zap,
  Award,
} from "lucide-react"

export const Icons = {
  users: Users,
  dollar: DollarSign,
  creditCard: CreditCard,
  chart: LineChart,
  home: Home,
  settings: Settings,
  bell: Bell,
  message: MessageSquare,
  user: User,
  file: FileText,
  stats: BarChart2,
  lock: Lock,
  mail: Mail,
  shield: Shield,
  briefcase: Briefcase,
  trending: TrendingUp,
  activity: Activity,
  pie: PieChart,
  refresh: RefreshCw,
  globe: Globe,
  database: Database,
  layers: Layers,
  zap: Zap,
  award: Award,
  logo: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 12l2 2l4 -4" />
      <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
    </svg>
  ),
}
