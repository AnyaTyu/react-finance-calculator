import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
          <div className='left'>
              <Сounting title='Доходы:' placeholderText='Зарплата' placeholderCost='30000'/>
          </div>
          <div className='right'>
              <Сounting title='Обязательные расходы:' placeholderText='Аренда квартиры' placeholderCost='10000'/>
          </div>
      </div>
    );
  }
}

class Сounting extends Component {
    render() {
        const { title, placeholderText, placeholderCost } = this.props;

        return (
            <div className='Сounting'>
                <h2 className='title'>{title}</h2>
                <CalculationPlace placeholderText={placeholderText} placeholderCost={placeholderCost} />
            </div>
        );
    }
}

class CalculationPlace extends Component {
    state = {
        data: [],
        name: '',
        cost: '',
        error: false
    };

    render() {
        const { name, cost, data, error } = this.state;
        const { placeholderText, placeholderCost} = this.props;

        return (
            <form>
                <input
                    type='text'
                    name='name'
                    placeholder={placeholderText}
                    value={name}
                    onChange={this.handleChange.bind(this)}
                />
                <input
                    type='text'
                    name='cost'
                    placeholder={placeholderCost}
                    value={cost}
                    onChange={this.handleChange.bind(this)}
                />
                <button onClick={this.handleSubmit.bind(this)}>Добавить</button>
                <MyTable data={data} />
                <Notification ref='notification' />
            </form>
        )
    }

    handleSubmit(e) {
        e.preventDefault();

        const { name, cost, data } = this.state;

        if ( !name || !cost || !parseInt(cost, 10) ) {
            this.refs.notification.handleOpen();
            return;
        }

        data.push({
            name: name,
            cost: cost
        });

        this.setState({ data, name: '', cost: '' });
        this.refs.notification.handleClose();
    }

    handleChange(e) {
        let { name, value } = e.target;

        this.setState({ [name]: value });
        this.refs.notification.handleClose();
    }
}

class MyTable extends Component {
    render() {
        const { data } = this.props;
        const sum = data.reduce((value, item) => {
            return value + parseInt(item.cost, 10)
        }, 0);

        return (
            <div className='MyTable'>
                <table>
                    <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Цена</th>
                    </tr>
                    </thead>
                    <tbody>{data.map((item, index) => <Row key={index} name={item.name} cost={item.cost} />)}</tbody>
                </table>
                <p className='sum'>Итого: {sum}</p>
            </div>
        )
    }
}

class Row extends Component {
    render() {
        const { name, cost } = this.props;

        return (
            <tr>
                <td>{name}</td>
                <td>{cost}</td>
            </tr>
        )
    }
}

class Notification extends Component {
    state= {
        visible: false
    };

    handleOpen() {
        this.setState({ visible: true });
    }

    handleClose() {
        this.setState({ visible: false });
    }

    render() {
        if (!this.state.visible) {
            return null;
        }

        return (
            <div className='Notification' onClick={this.handleClose.bind(this)}>Не правильно заполнены поля!</div>
        )
    }
}

export default App;
