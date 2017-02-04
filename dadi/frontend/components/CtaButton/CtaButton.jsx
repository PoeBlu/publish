import { h, Component } from 'preact'

import Styles from './CtaButton.scss'

export default class CtaButton extends Component {
  render() {
    const { type } = this.props
    const classes = { 'CtaButton': true }
    if (type) classes[`CtaButton--${type}`] = true

    return (
      <button onClick={this.props.onClick} class={classes}>
        {this.props.children}
      </button>
    )
  }
}
