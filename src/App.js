import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        income: 0,
        costs: 0
    };

    render() {
        const { income, costs } = this.state;

        return (
            <div className='app app_theme_blue'>
                <h1 className='heading'>Калькулятор 'Мои деньги'</h1>
                <div className='left'>
                    <h2 className='title'>Доходы:</h2>
                    <CalculationPlace
                        placeholderText='Зарплата'
                        placeholderCost='30000'
                        type='income'
                        bindFunc={ this.handleChildFunc.bind(this) }
                    />
                </div>
                <div className='right'>
                    <h2 className='title'>Обязательные расходы:</h2>
                    <CalculationPlace
                        placeholderText='Аренда квартиры'
                        placeholderCost='10000'
                        type='costs'
                        bindFunc={ this.handleChildFunc.bind(this) }
                    />
                </div>
                <CommonCounting income={ income } costs={ costs }/>
            </div>
        );
    }

    handleChildFunc (type, sum) { this.setState({ [type]: sum }); }
}

class CalculationPlace extends Component {
    state = {
        data: [],
        sum: 0,
        name: '',
        cost: '',
        error: false
    };

    render() {
        const { name, cost, data, sum } = this.state;
        const { placeholderText, placeholderCost } = this.props;

        return (
            <form>
                <input
                    type='text'
                    name='name'
                    placeholder={ placeholderText }
                    value={ name }
                    onChange={ this.handleChange.bind(this) }
                />
                <input
                    type='text'
                    name='cost'
                    placeholder={ placeholderCost }
                    value={ cost }
                    onChange={ this.handleChange.bind(this) }
                />
                <button onClick={ this.handleSubmit.bind(this) }>Добавить</button>
                <MyTable data={ data } sum={ sum } />
                <Notification ref='notification' />
            </form>
        )
    }

    handleSubmit(e) {
        e.preventDefault();

        const { name, cost, data } = this.state;
        const { type, bindFunc } = this.props;
        const { notification } = this.refs;

        if ( !name || !cost || !parseInt(cost, 10) ) {
            this.refs.notification.handleOpen();
            return;
        }

        data.push({
            name: name,
            cost: cost
        });

        const sum = data.reduce((value, item) => {
            return value + parseInt(item.cost, 10)
        }, 0);

        this.setState({ data, name: '', cost: '', sum });
        bindFunc(type, sum);
        notification.handleClose();
    }

    handleChange(e) {
        const { name, value } = e.target;

        this.setState({ [name]: value });
        this.refs.notification.handleClose();
    }
}

class MyTable extends Component {
    render() {
        const { data, sum } = this.props;

        return (
            <div className='myTable'>
                <table>
                    <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Цена</th>
                    </tr>
                    </thead>
                    <tbody>{ data.map((item, index) => <Row key={ index } name={ item.name } cost={ item.cost } />) }</tbody>
                </table>
                <p className='sum'>Итого: { sum }</p>
            </div>
        )
    }
}

class Row extends Component {
    render() {
        const { name, cost } = this.props;

        return (
            <tr>
                <td>{ name }</td>
                <td>{ cost }</td>
            </tr>
        )
    }
}

class Notification extends Component {
    state = {
        visible: false
    };

    handleOpen() {
        this.setState({ visible: true });
    }

    handleClose() {
        this.setState({ visible: false });
    }

    render() {
        if (!this.state.visible) return null;

        return (
            <div className='notification' onClick={ this.handleClose.bind(this) }>Не правильно заполнены поля!</div>
        )
    }
}

class CommonCounting extends Component {
    render() {
        const { income, costs } = this.props;
        const netIncome = income - costs;
        const dayBudget = netIncome / 30; //TODO: прикрутить месяц
        const monthAccumulation = 0;
        const yearAccumulation = 0;

        return (
            <div className='commonCounting'>
                <h2 className='title'>Основные подсчеты:</h2>
                <CommonCountingRow label='Доход' value={ netIncome }/>
                <CommonCountingRow label='Бюджет на день' value={ dayBudget }/>
                <CommonCountingRow label='Накопления за месяц' value={ monthAccumulation }/>
                <CommonCountingRow label='Накопления за год' value={ yearAccumulation }/>
            </div>
        )
    }
}

class CommonCountingRow extends Component {
    render() {
        return (
            <div className='commonCountingRow'>
                <div className='label'>{ this.props.label }</div>
                <input
                    type='text'
                    name='value'
                    value={ this.props.value }
                />
            </div>
        )
    }
}

export default App;
