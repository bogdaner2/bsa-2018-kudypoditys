import React from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react'
import { required} from 'client/regexValidationService';
import { Field} from 'redux-form';
import { Icon } from 'semantic-ui-react';
import {bedType,bedAmount} from './options.js';
import semanticSelectorFormField from './dropdown-form/semanticSelectorForm'

class ComplexInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            beds: [
                {key:0,key1: 3, value:1, amount:1, type:'Односпальне / (ширина 90-130см)', display:true, button:false},
                {key:1,key1: 4, value:1, amount:1, type:'Односпальне / (ширина 90-130см)', display:false, button:true},
                {key:2,key1: 5, value:1, amount:1, type:'Односпальне / (ширина 90-130см)', display:false, button:true}
            ],
            guests:1,
            index:0
        }
    }
    handleSelect(value, name){
        console.log(value, name)
    }
    setGuests(){
        let amount = 0;
        for(let bed of this.state.beds){
            if(bed.display){
                amount+=bed.value*bed.amount
            }
        }
        this.setState({guests:amount})
    }
    handleClickAdd(){
       const index = this.state.index;
       this.state.index<2
        ?
            this.setState({index:index+1},()=>{
                let beds = this.state.beds;
                beds[this.state.index].display = true;
                this.setState({
                    beds:beds,
                 },()=>this.setGuests())
            })
        :
        this.setState({index:index})
    }
    handleInputChange(e){
        const value = e.target.value;
        this.setState({guests:value})
    }
    handleDelete(){
       const index = this.state.index;
       let beds = this.state.beds;
       beds[this.state.index].display = false;
       this.setState({
           beds:beds,
        },()=>this.setGuests())
        this.state.index>0
            ?
            this.setState({index:index-1},()=>console.log(this.state))
            :
            this.setState({index:index})
    }
    render(){
            const beds =this.state.beds;
            const inputs = beds.map((bed)=>(

            bed.display===true?
                <div key={bed.key} className='complex-input'>
                <div>
                    <Field
                        key={bed.key}
                        style={{width:'120px', margin:'0 0 0 10px', float:'left'}}
                        name={'bed'+bed.key}
                        component={semanticSelectorFormField}
                        as={Form.Select}
                        options={bedType}
                        onChange={this.handleSelect}
                        label="Тип номеру"
                        placeholder="Виберіть"
                        validate={required}
                    />
                </div>
                    <p>X</p>
                    <div>
                    <Field
                        key={bed.key1}
                        style={{width:'120px', margin:'0 0 0 10px', float:'left'}}
                        name={"bed"+bed.key1}
                        component={semanticSelectorFormField}
                        as={Form.Select}
                        options={bedAmount}
                        onChange={this.handleSelect}
                        placeholder="Виберіть"
                        validate={required}
                    />
                    </div>
                    {bed.button?
                    <div onClick={this.handleDelete.bind(this)} className='delete-btn'>
                        <Icon name='remove circle' color='red'/>
                        Видалити
                    </div>
                    :
                    null
                    }
                </div>
                :
                null
            ));

        return(
            <div className='plan-price-form'>
                    <div name='2' className="plan-price-form-group">
                        <h3>Ліжка</h3>
                        <span>
                            Розкажіть тільки про основні ліжка в номері.
                            Не включайте інформацію про додаткові ліжка.
                        </span>
                        {inputs}

                        {this.state.index === 2
                        ?
                            null
                        :
                            <div className='add-btn' onClick={this.handleClickAdd.bind(this)}>
                                 <Icon id='add-icon' name='add circle' color='blue'/>
                                <span>Додати</span>
                            </div>
                        }

                       <p id='guestAmountTitle'>Скільки людей можуть зупинитись цьому в номері?</p>
                        <input onChange={this.handleInputChange.bind(this)} name='guestsAmount' type="text" value={this.state.guests}/>
                    </div>
            </div>
        )
    }
}
export default ComplexInput;

