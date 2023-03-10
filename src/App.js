import { App, ConfigProvider } from 'antd';
import './App.css';
import Projects from "./Projects";
import Plan from "./Plan";

function homePage(){
  return (
    <ConfigProvider>
      <App>
        {Plan()}
        {Projects()}
      </App>
    </ConfigProvider>
  )
}

export default homePage;
