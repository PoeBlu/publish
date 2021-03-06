import {h, options, render} from 'preact'
import {expect} from 'chai'

import Toolbar from './Toolbar'
// DOM setup
let $, mount, root, scratch

options.debounceRendering = f => f()

beforeAll(() => {
  $ = sel => scratch.querySelectorAll(sel)
  mount = jsx => root = render(jsx, scratch, root)
  scratch = document.createElement('div')
})

beforeEach(() => {
  document.body.appendChild(scratch)
})

afterEach(() => {
  mount(null).remove()
  document.body.removeChild(document.body.firstChild)
})

describe('Toolbar component', () => {
  it('has propTypes', () => {
    const component = (
      <Toolbar />
    )

    expect(component.nodeName.propTypes).to.exist
    expect(Object.keys(component.nodeName.propTypes)).to.have.length.above(0)
  })

  it('returns `null` if no `children` prop is empty', () => {
    const component = (
      <Toolbar />
    )

    mount(component)

    expect(component).to.equal(null)
  })

  it('renders a `<footer>` node containing children', () => {
    const component = (
      <Toolbar>
        <div>foo</div>
      </Toolbar>
    )

    const template = (
      <footer class="container container-padded">
        (...)
      </footer>
    )

    expect(component).to.matchTemplate(template)
  })

  it('does not apply padded class when `padded` prop is falsy', () => {
    const component = (
      <Toolbar
        padded={false}
      >
        <div>foo</div>
      </Toolbar>
    )

    const template = (
      <footer class="container">
        (...)
      </footer>
    )

    expect(component).to.matchTemplate(template)
  })
})
