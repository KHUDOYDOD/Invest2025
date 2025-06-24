"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "Как начать инвестировать на платформе?",
    answer:
      "Чтобы начать инвестировать, вам необходимо зарегистрироваться на нашей платформе, пополнить баланс и выбрать подходящий инвестиционный план. После этого ваши инвестиции начнут приносить доход согласно выбранному тарифу.",
  },
  {
    question: "Какие способы пополнения и вывода средств доступны?",
    answer:
      "Мы поддерживаем различные способы пополнения и вывода средств, включая банковские карты, электронные кошельки и криптовалюты. Полный список доступных платежных систем вы можете найти в личном кабинете.",
  },
  {
    question: "Как быстро происходят выплаты?",
    answer:
      "Выплаты обрабатываются автоматически в течение 24 часов после создания заявки на вывод средств. В большинстве случаев средства поступают на ваш счет значительно быстрее.",
  },
  {
    question: "Есть ли у вас реферальная программа?",
    answer:
      "Да, у нас есть многоуровневая реферальная программа. Вы получаете вознаграждение до 10% от депозитов приглашенных вами инвесторов. Подробные условия реферальной программы доступны в личном кабинете.",
  },
  {
    question: "Как рассчитывается доходность?",
    answer:
      "Доходность рассчитывается в соответствии с выбранным вами инвестиционным планом. Начисления происходят ежедневно и автоматически отображаются в вашем личном кабинете.",
  },
  {
    question: "Могу ли я инвестировать в нескольких планах одновременно?",
    answer:
      "Да, вы можете одновременно инвестировать в несколько различных планов. Это позволит вам диверсифицировать свои инвестиции и оптимизировать доходность.",
  },
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Часто задаваемые вопросы</h2>
          <p className="text-xl text-slate-600">Ответы на самые популярные вопросы о нашей платформе</p>
        </div>

        <Accordion type="multiple" value={openItems} className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger onClick={() => toggleItem(`item-${index}`)} className="text-left font-medium text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
