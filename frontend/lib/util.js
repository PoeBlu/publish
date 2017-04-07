'use strict'

import * as Constants from 'lib/constants'
import {bindActionCreators} from 'redux'
import {connect} from 'preact-redux'

export function connectHelper (stateMap, dispatchMap) {
  return connect((state) => {
    return {
      state: stateMap(state)
    }
  }, (dispatch) => {
    if (dispatchMap) {
      return {
        actions: dispatchMap(dispatch)
      }
    }

    return {
      dispatch
    }
  })
}

// Generates a unique ID for DOM elements
let lastId = 0

// Having a prefix is useful in case we ever decide to do
// server-side rendering. In that case, components generated
// on the server should have a different prefix from the ones
// generated on the client to avoid conflicts
const ID_PREFIX = 'c'

export function getUniqueId () {
  return `${ID_PREFIX}-${lastId++}`
}

export function urlHelper () {
  return {
    paramsToObject (source) {
      if (!source || typeof source === 'undefined') return null
      let params = JSON.parse('{"' + decodeURI(source.replace(/^(\?)/, ''))
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') + '"}')

      Object.keys(params).forEach(param => {
        try {
          params[param] = JSON.parse(params[param])
        } catch (e) {
          return
        }
      })

      return params
    },
    paramsToString (params) {
      return Object.keys(params)
        .filter(key => params[key])
        .map(key => {
          if (typeof params[key] === 'object') {
            try {
              return key + '=' + JSON.stringify(params[key])
            } catch (e) {
              return key + '=' + params[key]
            }
          } else {
            return key + '=' + params[key]
          }
        })
        .join('&')
    }
  }
}

export const Case = {
  sentence (value) {
    if (!value) return ''

    return value.split('.').map(sentence => {
      return sentence[0].toUpperCase() + sentence.slice(1)
    }).join('.')
  }
}

export function objectToArray (obj, keyField) {
  if (!obj) return []

  return Object.keys(obj).map(key => {
    return Object.assign({}, {[keyField || 'key']: key, value: obj[key]})
  })
}

export function arrayToObject (arr, keyField) {
  if (!arr.length) return null

  return Object.assign({}, ...arr.map(obj => {
    return {[obj[keyField] || 'key']: obj.value}
  }))
}

// Object and Field validation
export function isValidJSON (string) {
  if (!string || typeof string !== 'string') return

  return /^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
}

export function isEmpty (subject) {
  return !subject || (typeof subject === 'object' && subject.length < 1)
}

export function slugify (str) {
  return str.toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/\/+/g, '-')     // Replace slashes with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '')       // Trim - from end of text
}

export function debounce (func, wait, immediate) {
  let timeout

  return function () {
    let context = this
    let args = arguments
    let later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function throttle (func, threshold) {
  let lastCall
  let timeout

  return function () {
    let now = new Date().getTime()
    let args = arguments

    if (lastCall && (now < lastCall + threshold)) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        lastCall = now
        func.apply(this, args)
      }, threshold)
    } else {
      lastCall = now
      func.apply(this, args)
    }
  }
}

export function setPageTitle (title) {
  document.title = `${title} / DADI Publish`
}

export function filterHiddenFields (fields, type) {
  if (!(typeof type === 'string')) {
    return fields
  }

  return Object.assign({}, ...Object.keys(fields)
    .filter(key => {
      // If the publish && display block don't exist, or if the given type is
      // true,  allow this field to pass.
      return !fields[key].publish ||
        !fields[key].publish.display ||
        fields[key].publish.display[type]
    }).map(key => {
      return {[key]: fields[key]}
    })
  )
}
