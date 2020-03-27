import pubsub from './pubsub'
import styles from './lang.module.css'

const LangModule = (langFile)=>{
  const getLang = ()=>{
    var lang = 'en';
    
    try {
      lang = localStorage.getItem('lang') || 'en'
    } catch(e){}

    return lang;
  }

  const setLang = (lang)=>{
    try {
      localStorage.setItem('lang', lang);

      pubsub.publish('lang', lang);
    } catch(e){}
  }

  const getLangString = (chain)=>{
    let arr = chain.split('.');

    var pointer = langFile;
    
    let lang = getLang();

    arr.forEach((item)=>{
      pointer = pointer[item];
    })

    try {
      return pointer[lang];
    } catch(e){
      console.log('chain', chain);
      return '';
    }
  }

  class Lang extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        value: this.getString()
      }
    }

    getString=()=>{
      if(this.props.apiResult){
        return this.props.apiResult[`${this.props.value}_${getLang()}`]
      } else {
        return getLangString(this.props.value);
      }
    }

    componentDidMount(){
      this.mounted = true;

      pubsub.subscribe('lang', ()=>{
        if(this.mounted) this.setState({value: this.getString()})
      });
    }

    componentWillUnmount(){
      this.mounted = false;

      pubsub.unsubscribe('lang');
    }

    render(){
      return this.state.value || null;
    }
  }

  const LangSwitcher = ()=>{
    return <div className={styles.langSwitcher}>
      <button onClick={()=>{
        setLang('en');
      }}>English</button>
      <button onClick={()=>{
        setLang('es');
      }}>Español</button>
    </div>
  }

  return { getLang, setLang, getLangString, LangSwitcher, Lang }

}

export default LangModule;
