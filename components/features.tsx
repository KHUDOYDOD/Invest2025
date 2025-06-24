import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  RefreshCw,
  BarChart3,
  Users,
  Clock,
  Award,
  Lock,
  TrendingUp,
  Headphones,
  CreditCard,
  Globe,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Максимальная безопасность",
      description:
        "Ваши инвестиции защищены 256-битным шифрованием SSL, двухфакторной аутентификацией и холодным хранением средств",
      badge: "Сертифицировано",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: "Мгновенные выплаты",
      description:
        "Автоматические выплаты прибыли каждые 24 часа на любую удобную платежную систему без задержек и скрытых комиссий",
      badge: "24/7",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
      title: "Стабильная доходность",
      description:
        "Прозрачная система начислений с гарантированной доходностью от 1.2% до 3.2% в день в зависимости от выбранного тарифа",
      badge: "До 3.2%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-orange-600" />,
      title: "Детальная аналитика",
      description:
        "Полная статистика инвестиций, доходов и операций в режиме реального времени с возможностью экспорта отчетов",
      badge: "Real-time",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Users className="h-12 w-12 text-indigo-600" />,
      title: "Партнерская программа",
      description:
        "Многоуровневая реферальная система с комиссией до 10% от депозитов приглашенных инвесторов + бонусы за активность",
      badge: "До 10%",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Headphones className="h-12 w-12 text-teal-600" />,
      title: "Поддержка премиум-класса",
      description:
        "Профессиональная техническая поддержка 24/7 на русском языке через чат, email и телефон с гарантией ответа в течение 5 минут",
      badge: "5 мин",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <Award className="h-12 w-12 text-yellow-600" />,
      title: "Лицензированная деятельность",
      description:
        "Официально зарегистрированная компания с международными лицензиями и сертификатами качества финансовых услуг",
      badge: "Лицензия",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Lock className="h-12 w-12 text-red-600" />,
      title: "Страхование депозитов",
      description:
        "Все инвестиции застрахованы в международной страховой компании на сумму до $100,000 на каждого клиента",
      badge: "$100K",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <CreditCard className="h-12 w-12 text-blue-600" />,
      title: "Множество способов оплаты",
      description:
        "Поддержка всех популярных платежных систем: банковские карты, электронные кошельки, криптовалюты и банковские переводы",
      badge: "20+ методов",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <RefreshCw className="h-12 w-12 text-green-600" />,
      title: "Автоматическое реинвестирование",
      description:
        "Возможность автоматического реинвестирования прибыли для максимизации дохода с гибкими настройками процентов",
      badge: "Авто",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Globe className="h-12 w-12 text-purple-600" />,
      title: "Международная платформа",
      description:
        "Работаем в 50+ странах мира с поддержкой множества валют и соблюдением международных стандартов безопасности",
      badge: "50+ стран",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Clock className="h-12 w-12 text-orange-600" />,
      title: "Мгновенный старт",
      description:
        "Начните инвестировать уже через 2 минуты после регистрации. Простая верификация и быстрое пополнение счета",
      badge: "2 мин",
      color: "from-orange-500 to-yellow-500",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Преимущества нашей платформы</h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Мы создали самую надежную и технологически продвинутую платформу для ваших инвестиций с максимальным уровнем
            безопасности и доходности
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              SSL Сертификат
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Международная лицензия
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              50,000+ инвесторов
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-white group-hover:to-slate-100 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`bg-gradient-to-r ${feature.color} text-white border-none font-semibold`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative">
                <CardDescription className="text-slate-600 text-base leading-relaxed group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </CardDescription>
              </CardContent>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl max-w-5xl mx-auto border border-slate-200">
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Почему более 50,000 инвесторов выбрали нас?</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-slate-600">Время работы платформы</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$50M+</div>
                <div className="text-sm text-slate-600">Выплачено инвесторам</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-slate-600">Техническая поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">5 лет</div>
                <div className="text-sm text-slate-600">Успешной работы</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
