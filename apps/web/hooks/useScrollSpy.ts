import { useEffect, useState, useCallback } from 'react'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { useEvent } from 'react-use'
import { polyfill } from 'smoothscroll-polyfill'

const guessVisibleSection = (
  ids: string[],
  marginTop: number,
): string | null => {
  if (ids.length === 0) return null

  // top of the page is a special case because otherwise we might match the
  // second page section if the first one is small enough
  if (window.scrollY <= 0) return ids[0]

  return ids.reduce((match, id) => {
    const el = document.getElementById(id)
    // so we dont throw an error if the element is not found
    if (!el) {
      return '0'
    }
    const elPosY = Math.floor(el.getBoundingClientRect().top) + window.scrollY
    return window.scrollY + marginTop >= elPosY ? id : match
  }, ids[0])
}

export const scrollTo = (
  id: string,
  {
    marginTop = 0,
    smooth = false,
  }: { marginTop?: number; smooth?: boolean } = {},
) => {
  polyfill()
  const rect = document.getElementById(id).getBoundingClientRect()
  window.scrollTo({
    top: Math.floor(rect.top) + window.scrollY - marginTop,
    behavior: smooth ? 'smooth' : 'auto',
  })
}

const useScrollSpy = (
  ids: string[],
  {
    marginTop = 80,
    smooth = false,
  }: { marginTop?: number; smooth?: boolean } = {},
): [string | undefined, (id: string) => void] => {
  const [current, setCurrent] = useState(ids[0])

  // flag to ignore scroll event when user navigates manually
  const [ignore, setIgnore] = useState(false)

  // every time scrolling stops we'll reset the ignore flag
  const checkScrollStop = useCallback(
    debounce(() => setIgnore(false), 50),
    [setIgnore],
  )
  useEvent('scroll', checkScrollStop, process.browser && window)

  // function to manually navigate
  const navigate = useCallback(
    (id: string) => {
      setCurrent(id)
      setIgnore(true)
      scrollTo(id, { marginTop: marginTop, smooth: smooth })
    },
    [setCurrent, setIgnore],
  )

  // throttled function to update the active section id
  const updateCurrent = useCallback(
    throttle(() => {
      if (!ignore) {
        setCurrent(guessVisibleSection(ids, marginTop))
      }
    }, 100),
    [ids, ignore, setCurrent],
  )

  // update if id list changes
  useEffect(updateCurrent, [ids])

  // and call the update function on scroll and resize
  useEvent('scroll', updateCurrent, process.browser && window)
  useEvent('resize', updateCurrent, process.browser && window)

  return [current, navigate]
}

export default useScrollSpy
