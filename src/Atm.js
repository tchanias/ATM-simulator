import React, {useState,useEffect} from 'react'
import {Fab,Button,FormControl,Select,MenuItem} from '@material-ui/core';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

library.add(faMoneyBillWave);

export  const  Atm=(props)=>   {
    
const [value,setValue] = useState(0);
const [bnk_100,setBnk_100] = useState(0);
const [bnk_500,setBnk_500] = useState(0);
const [bnk_1000,setBnk_1000] = useState(0);
const [modalOpen,setModalOpen] = useState(false);
const [modalTitle,setModalTitle] = useState('');
const [modalText,setModalText] = useState('');
const [theme,setTheme] = useState('basic');
const [listDisplayed,setListDisplayed] = useState(true);



    useEffect(()=> {
            let storedTheme = localStorage.getItem('theme');
            if(!storedTheme){
                localStorage.setItem('theme', 'basic')
            }else{
              setTheme(storedTheme);
            }    
      },[]);


function handleDigitPress(digit){
  
        if(value===0){
            setValue(digit);
        }else{
            let newValue = parseInt(""+value+digit)
            setValue(newValue);
        }
    
    

}

function handleThemeChange(e){
    localStorage.setItem('theme', e.target.value)
    setTheme(e.target.value);
}

function handleCloseModal(){
setModalOpen(false);
}

function handleBackspace(){
    let newValue = ((value-(value%10))/10)
        setValue(newValue);
    }

   function handleOpenModal(){
        if(!value||value===0){
            setModalOpen(true);
            setModalTitle("Error");
            setModalText('Please specify the amount');
            setListDisplayed(false);
        }
        else if(value<100){
            setModalOpen(false);
            setModalTitle(`Small amount requested: $${value}`);
            setModalText('The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills');
            setListDisplayed(false);
        }
        else{
        axios.post('https://us-central1-atm-backend-2cc1b.cloudfunctions.net/withdraw',{"amount":value}
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
                setModalOpen(true);
                setModalTitle(`Success`);
                setModalText('Please take your cash');
                setBnk_100(bnk100);
                setBnk_500(bnk500);
                setBnk_1000(bnk1000);
                setListDisplayed(true);
               
            }else{
                setModalOpen(true);
                setModalTitle(`Cannot Withdraw the amount: $${value}`);
                setModalText('The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills');
                setListDisplayed(false);
            
            }
        }).catch(error=>{
            setModalOpen(true);
            setModalTitle(`Cannot Withdraw the amount: $${value}`);
            setModalText('The ATM can extract only an amount of $100 or more and the amount should be divisible by a combination of $100 , $500 and $1000 bills.');
            setListDisplayed(false);
        })
        }
    }

  
        return (
            <div className={`theme-container theme-${theme}`}>
            <div className="atm-container">
                <div className={'select-container'}>
                <FormControl className={'select-control'}>
                    <Select
                    className="select-input"
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    MenuProps={{className:`theme-${theme}`}}
                    value={theme}
                    onChange={handleThemeChange}
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
                        <NumberFormat  thousandSeparator={'.'} decimalSeparator={','}  className="atm-screen" value={value}
                        disabled prefix={'$'} />
                        </div>
                        <div className="atm-button-container">
                            <div className="atm-button-row atm-button-row-1">
                                <Fab size="medium" onClick={()=>handleDigitPress(1)} className={'atm-pad-button atm-pad-button-left atm-pad-button-1'}>1</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(2)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-2'}>2</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(3)} className={'atm-pad-button atm-pad-button-right atm-pad-button-3'}>3</Fab>
                            </div>
                            <div className="atm-button-row atm-button-row-2">
                                <Fab size="medium" onClick={()=>handleDigitPress(4)} className={'atm-pad-button atm-pad-button-left atm-pad-button-4'}>4</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(5)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-5'}>5</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(6)} className={'atm-pad-button atm-pad-button-right atm-pad-button-6'}>6</Fab>
                            </div>
                        
                            <div className="atm-button-row atm-button-row-3">
                                <Fab size="medium" onClick={()=>handleDigitPress(7)} className={'atm-pad-button atm-pad-button-left atm-pad-button-7'}>7</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(8)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-8'}>8</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(9)} className={'atm-pad-button atm-pad-button-right atm-pad-button-9'}>9</Fab>
                            </div>

                            <div className="atm-button-row atm-button-row-4">
                                <Fab size="medium"  className={'atm-pad-button atm-pad-button-right atm-pad-button-inv'}>X</Fab>
                                <Fab size="medium" onClick={()=>handleDigitPress(0)} className={'atm-pad-button atm-pad-button-middle atm-pad-button-0'}>0</Fab>
                                <Fab size="medium" onClick={()=>handleBackspace()} className={'atm-pad-button atm-pad-button-right atm-pad-button-back'}><BackspaceOutlinedIcon/></Fab>
                            </div>

                        </div>
                        <div className="action-button-container">
                            
                        <Button variant="outlined" onClick={handleOpenModal} className={'action-button'}>
                            WITHDRAW
                        </Button>
                        
                        </div>
                        <Modal
                            className={`modal-container theme-${theme}`}
                            show={modalOpen}
                            onHide={handleCloseModal}
                        >
                            <Modal.Header className={'modal-header'}>
                                {modalTitle}
                            </Modal.Header>
                            <Modal.Body className={'modal-body'}>
                                         <p className='modal-subtitle'>{modalText}</p>
                                         <div className='bill-list' style={listDisplayed?{display:'block'}:{display:'none'}}>
                                            <div className='modal-1000 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$1000</span> x{' '}{bnk_1000}</div>
                                            <div className='modal-500 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$500</span>{' '} x{' '}{bnk_500}</div>
                                            <div className='modal-100 modal-span'><FontAwesomeIcon icon="money-bill-wave" color={'green'} />{' '}<span className='bill'>$100</span>{' '} x{' '}{bnk_100}</div>
                                         </div>             
                            </Modal.Body>
                            <Modal.Footer>
                                  <Button variant="contained" onClick={handleCloseModal} className='modal-close-button'>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            </div>
        )
    
}
