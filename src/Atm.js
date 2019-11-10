import React, { Component,} from 'react'
import {Fab,Button,FormControl,Select,MenuItem} from '@material-ui/core';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

library.add(faMoneyBillWave);

export default class Atm extends Component {
    constructor(props){
        super(props);

        this.state={
            value:0,
            bnk_100:0,
            bnk_500:0,
            bnk_1000:0,
            modalOpen:false, 
            modalTitle:'',
            modalText:'',
            theme:'basic',
            listDisplayed:true,
        }
    }

    componentDidMount() {
        let storedTheme = localStorage.getItem('theme');
        if(!storedTheme){
            localStorage.setItem('theme', 'basic')
        }else{
            this.setState({theme:storedTheme });
        }
        
      }


handleDigitPress=(digit)=>{
  
        if(this.state.value===0){
            this.setState({value:digit})
        }else{
            let newValue = parseInt(""+this.state.value+digit)
            this.setState({value:newValue})
        }
    
    

}

handleThemeChange=(e)=>{
    localStorage.setItem('theme', e.target.value)
this.setState({theme:e.target.value})
}

handleCloseModal=()=>{
    this.setState({modalOpen:false})
}

handleBackspace=()=>{
    let newValue = ((this.state.value-(this.state.value%10))/10)
    this.setState({value:newValue})
    }

    handleOpenModal=()=>{
        if(!this.state.value||this.state.value===0){
            this.setState({
                modalOpen:true,
                modalTitle:`Error`,
                modalText:'Please specify the amount',
            listDisplayed:false})
        }
        else if(this.state.value<100){
            this.setState({
                modalOpen:true,
                modalTitle:`Small amount requested: $${this.state.value}`,
                modalText:'The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills',
            listDisplayed:false})
        }
        else{
        axios.post('https://us-central1-atm-backend-2cc1b.cloudfunctions.net/withdraw',{"amount":this.state.value}
        )
        .then(res=>{
            let bnk1000=0;
            let bnk500=0;
            let bnk100=0
            if (res.data){
                res.data.map(note=>{
                    if(note.banknoteValue===100){
                        bnk100=note.quantity
                    }
                    if(note.banknoteValue===500){
                        bnk500=note.quantity
                    }
                    if(note.banknoteValue===1000){
                        bnk1000=note.quantity
                    }
                });
                this.setState({
                    modalOpen:true,
                    modalTitle:`Success`,
                    modalText:'Please take your cash',
                    bnk_100:bnk100,
                    bnk_500:bnk500,
                    bnk_1000:bnk1000,
                listDisplayed:true})
            }else{
                this.setState({
                    modalOpen:true,
                    modalTitle:`Cannot Withdraw the amount: $${this.state.value}`,
                    modalText:'The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills',
                listDisplayed:false})
            }
        }).catch(error=>{
            this.setState({
                modalOpen:true,
                modalTitle:`Cannot Withdraw the amount: $${this.state.value}`,
                modalText:'The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills.',
            listDisplayed:false})
        })
        }
    }

    render() {
        return (
            <div className={`theme-container theme-${this.state.theme}`}>
            <div className="atm-container">
                <div className={'select-container'}>
                <FormControl className={'select-control'}>
                    <Select
                    className="select-input"
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    MenuProps={{className:`theme-${this.state.theme}`}}
                    value={this.state.theme}
                    onChange={this.handleThemeChange}
                    >
                    <MenuItem value={'basic'}>Light Theme</MenuItem>
                    <MenuItem value={'dark'}>Dark Theme</MenuItem>
                    <MenuItem value={'red'}>Red Theme</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <div className="atm-pad-container">
                    <div className="atm-pad-content">
                        <div className='atm-screen-container'>
                        <NumberFormat  thousandSeparator={'.'} decimalSeparator={','}  className="atm-screen" value={this.state.value}
                        disabled prefix={'$'} />
                        </div>
                        <div className="atm-button-container">
                            <div className="atm-button-row atm-button-row-1">
                                <Fab size="medium" onClick={()=>this.handleDigitPress(1)} className={'atm-pad-button atm-pad-button-left atm-pad-button-1'}>1</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(2)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-2'}>2</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(3)} className={'atm-pad-button atm-pad-button-right atm-pad-button-3'}>3</Fab>
                            </div>
                            <div className="atm-button-row atm-button-row-2">
                                <Fab size="medium" onClick={()=>this.handleDigitPress(4)} className={'atm-pad-button atm-pad-button-left atm-pad-button-4'}>4</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(5)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-5'}>5</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(6)} className={'atm-pad-button atm-pad-button-right atm-pad-button-6'}>6</Fab>
                            </div>
                        
                            <div className="atm-button-row atm-button-row-3">
                                <Fab size="medium" onClick={()=>this.handleDigitPress(7)} className={'atm-pad-button atm-pad-button-left atm-pad-button-7'}>7</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(8)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-8'}>8</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(9)} className={'atm-pad-button atm-pad-button-right atm-pad-button-9'}>9</Fab>
                            </div>

                            <div className="atm-button-row atm-button-row-4">
                                <Fab size="medium" onClick={()=>this.handleCancel()} className={'atm-pad-button atm-pad-button-right atm-pad-button-inv'}>X</Fab>
                                <Fab size="medium" onClick={()=>this.handleDigitPress(0)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-0'}>0</Fab>
                                <Fab size="medium" onClick={this.handleBackspace} className={'atm-pad-button atm-pad-button-right atm-pad-button-back'}><BackspaceOutlinedIcon/></Fab>
                            </div>

                        </div>
                        <div className="action-button-container">
                            
                        <Button variant="outlined" onClick={this.handleOpenModal} className={'action-button'}>
                            WITHDRAW
                        </Button>
                        
                        </div>
                        <Modal
                            className={`modal-container theme-${this.state.theme}`}
                            show={this.state.modalOpen}
                            onHide={this.handleCloseModal}
                        >
                            <Modal.Header className={'modal-header'}>
                                {this.state.modalTitle}
                            </Modal.Header>
                            <Modal.Body className={'modal-body'}>
                                         <p className='modal-subtitle'>{this.state.modalText}</p>
                                         <div className='bill-list' style={this.state.listDisplayed?{display:'block'}:{display:'none'}}>
                                            <div className='modal-1000 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$1000</span> x{' '}{this.state.bnk_1000}</div>
                                            <div className='modal-500 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$500</span>{' '} x{' '}{this.state.bnk_500}</div>
                                            <div className='modal-100 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$100</span>{' '} x{' '}{this.state.bnk_100}</div>
                                         </div>             
                            </Modal.Body>
                            <Modal.Footer>
                                  <Button variant="contained" onClick={this.handleCloseModal} className='modal-close-button'>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
