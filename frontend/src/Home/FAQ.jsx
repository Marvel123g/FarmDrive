import React, {useState} from 'react'
import { FiPlus, FiMinus } from "react-icons/fi";

export default function FAQ() {
    const [openQuestion, setOpenQuestion] = useState(null);
    const handleToggleQuestion = (id) => {
    setOpenQuestion(prev => prev === id ? false : id)
    }

    const FAQ = [
    {
        id: 1,
        question: "How does FarmDrive work?",
        answer: "FarmDrive allows farmers to post produce for delivery while drivers submit transport offers. Farmer can review these offers, select a driver, and track the delivery process."
    },
    {
        id: 2,
        question: "What do I need to join as a driver?",
        answer: "Drivers are required to provide valid identification, vehicle details to operate on the platform."
    },
    {
        id: 3,
        question: "Can farmers choose their preferred driver?",
        answer: "Yes, farmers can review multiple offers and select the driver that best meets their needs."
    },
    {
        id: 4,
        question: "How are drivers paid?",
        answer: "Drivers are paid based on the agreed delivery fee after each successful completion of a delivery."
    },
    {
        id: 5,
        question: "When is payment made?",
        answer: "Payment is typically made after the delivery has been successfully completed."
    }
    ]
    
  return (
    <>
       <section className="faq-section" id='FAQ'>
        <h2>Frequently Asked Questions</h2>
          {FAQ.map((item) => (
            <div className="faq-item" key={item.id}>
              <header>
                <h3>{item.question}</h3>
                <button onClick={() => handleToggleQuestion(item.id)}>
                  {openQuestion === item.id ? <FiPlus /> : <FiMinus />}
                </button>
              </header>
              {openQuestion === item.id && <p>{item.answer}</p>}
            </div>
          ))}
      </section>
    </>
  )
}
