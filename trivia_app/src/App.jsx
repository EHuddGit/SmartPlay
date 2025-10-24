import {BrowserRouter,Routes,Route} from "react-router-dom"
import StartScreen from "./components/StartScreen"
import QuizScreen from "./components/QuizScreen"
import ResultScreen from "./components/ResultScreen"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<StartScreen/>}/>
      <Route path="/quiz" element={<QuizScreen/>}/>
      <Route path="/results" element={<ResultScreen/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}