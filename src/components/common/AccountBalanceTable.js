import React from 'react';
import { TidePayAPI, VCUtils as Utils } from '../../logics';

export default class AccountBalanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balances: {},
    };
  }

  componentDidMount() {
    const { address } = this.props;
    const setBalances = (balances) => {
      const balanceObj = balances.lines.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.currency]: curr.balance,
        };
      }, {});
      this.setState({
        balances: balanceObj,
      });
      this.props.onGetAccountBalances(balanceObj);
    };
    const promise = TidePayAPI.getAccountBalances(address);
    this.balanceCancelablePromise = Utils.makeCancelable(promise);
    this.balanceCancelablePromise.promise
      .then(setBalances)
      .catch((err) => {
        if (err instanceof Error) {
          alert('Failed to get account balances');
          console.log('getAccountBalances', err);
        }
      });
  }

  componentWillUnmount() {
    this.balanceCancelablePromise.cancel();
  }

  render() {
    const { balances } = this.state;
    const rows = [];
    Object.keys(balances).forEach((key) => {
      rows.push(
        <tr key={key}>
          <td>{key}</td>
          <td>{balances[key]}</td>
        </tr>
      );
    });

    if (rows.length === 0) {
      return (
        <div>
          No currency!
        </div>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            <td>Currency</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
