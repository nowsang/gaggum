import "./Register.style.scss"
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa"
import { io } from "socket.io-client";
import { useEffect } from "react";

const RegisterController = ({ socket }) => {

  useEffect(() => {
    // 카메라 받기
    socket.on()

    return () => {
      // 카메라 종료
      socket.off()
    }
  }, [])

  const handleUp = () => {
    console.log("위")
    // 앞쪽으로 이동
    socket.emit("go_straight", { data: "go straight" })
  };

  const handleDown = () => {
    console.log("아래")
    // 뒤쪽으로 이동
    socket.emit("go_back", { data: "go back" })
  };

  const handleLeft = () => {
    console.log("왼쪽")
    // 왼쪽으로 이동
    socket.emit("go_left", { data: "go left" })
  };

  const handleRight = () => {
    console.log("오른쪽")
    // 오른쪽으로 이동
    socket.emit("go_right", { data: "go right" })
  };

  return (
    <div className="RegisterController">
      <div className="controller__up">
        <FaArrowAltCircleUp 
          size="100" 
          color="#022a17"
          onClick={handleUp}
        />
      </div>
      <div className="controller__down">
        <FaArrowAltCircleLeft 
          size="100" 
          color="#022a17"
          onClick={handleLeft}
        />
        <FaArrowAltCircleDown 
          size="100" 
          color="#022a17"
          onClick={handleDown}
        />
        <FaArrowAltCircleRight 
          size="100" 
          color="#022a17"
          onClick={handleRight}
        />
      </div>
    </div>
  )
};

export default RegisterController;