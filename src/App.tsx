import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import './App.css'

const siteBase = '/fragments-from-above-site'
const albumLink = 'https://linkco.re/3eCyT3YF'
const albumReleaseAtJst = Date.UTC(2026, 6, 9, 15)

type Track = {
  no: string
  title: string
  displayTitle?: string
  producer: string
  status: 'ALBUM' | 'SINGLE'
  note: string
  release?: string
  href?: string
  artwork?: string
  hoverArtwork?: string
}

type ActivityLink = {
  label: string
  href: string
  icon: string
}

function getYouTubeId(url?: string) {
  if (!url) {
    return null
  }

  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (parsed.hostname.endsWith('youtube.com')) {
      return parsed.searchParams.get('v')
    }
  } catch {
    return null
  }

  return null
}

function getAlbumActionLabel(now = Date.now()) {
  return now < albumReleaseAtJst ? 'Pre-Save' : 'Listen Now'
}

const tracks: Track[] = [
  {
    no: '01',
    title: 'ボトルメール',
    producer: 'bonnierogerr',
    status: 'ALBUM',
    note: '形のないモノが多すぎて、形を持てただけで違う気がしていた。',
    artwork: `${siteBase}/bottle-mail.webp`,
    hoverArtwork: `${siteBase}/bottle-mail-hover.webp`,
  },
  {
    no: '02',
    title: 'GRIP',
    producer: 'BOSTON MG',
    status: 'ALBUM',
    note: '"Fragments" itself is the Brand.',
    artwork: `${siteBase}/grip.webp`,
    hoverArtwork: `${siteBase}/grip-hover.webp`,
  },
  {
    no: '03',
    title: 'Fashion Villain',
    producer: 'Omamurin',
    status: 'ALBUM',
    note: '別人みたいな振る舞い、蝕ばまれていくプライベート。',
    artwork: `${siteBase}/fashion-villain.webp`,
    hoverArtwork: `${siteBase}/fashion-villain-hover.webp`,
  },
  {
    no: '04',
    title: 'No MoЯe Maze',
    producer: 'K4nji',
    status: 'SINGLE',
    note: '歪む視界の先で、走っていたんじゃなく、走らされていた。',
    release: '2026.03.20',
    href: 'https://youtu.be/Tqlrw9EWNx0',
    artwork: `${siteBase}/no-more-maze.webp`,
    hoverArtwork: `${siteBase}/no-more-maze-hover.webp`,
  },
  {
    no: '05',
    title: 'ヒトリゴト',
    producer: 'Anabolic Beatz',
    status: 'ALBUM',
    note: '同じ痛み持つなら効く錠剤、これもヒトリゴト。',
    artwork: `${siteBase}/hitorigoto.webp`,
    hoverArtwork: `${siteBase}/hitorigoto-hover.webp`,
  },
  {
    no: '06',
    title: 'Reflect Room',
    producer: 'Omamurin',
    status: 'ALBUM',
    note: '繰り返し聴いた曲が、ふと今日に返ってくる。',
    artwork: `${siteBase}/reflect-room.webp`,
    hoverArtwork: `${siteBase}/reflect-room-hover.webp`,
  },
  {
    no: '07',
    title: 'Scars to Skies',
    producer: 'K4nji',
    status: 'SINGLE',
    note: '傷を負ったままでも、飛ぶことを選ぶ。',
    release: '2025.12.09',
    href: 'https://youtu.be/naxuycpuZb0',
    artwork: `${siteBase}/scars-to-skies.webp`,
    hoverArtwork: `${siteBase}/scars-to-skies-hover.webp`,
  },
  {
    no: '08',
    title: 'Fallen feather',
    producer: 'K4nji',
    status: 'SINGLE',
    note: 'めくれど終わらぬ日々に、名前をつけた僕との違い',
    release: '2026.01.09',
    href: 'https://youtu.be/CHFP1MmYEXE',
    artwork: `${siteBase}/fallen-feather.webp`,
    hoverArtwork: `${siteBase}/fallen-feather-hover.webp`,
  },
  {
    no: '09',
    title: 'Still Loading, Continue?',
    displayTitle: 'Still Loading,Continue?',
    producer: 'Omamurin',
    status: 'ALBUM',
    note: '空いたポケットからこぼれる秒針で踊って。',
    artwork: `${siteBase}/still-loading-continue.webp`,
    hoverArtwork: `${siteBase}/still-loading-continue-hover.webp`,
  },
  {
    no: '10',
    title: 'Through My Words',
    producer: 'Peril',
    status: 'SINGLE',
    note: 'いつか誰かの線と交わるなら、生きた証になるこのフレーズ',
    release: '2025.11.09',
    href: 'https://youtu.be/JfLz46TY1NM',
    artwork: `${siteBase}/through-my-words.webp`,
    hoverArtwork: `${siteBase}/through-my-words-hover.webp`,
  },
  {
    no: '11',
    title: 'Best Bad Ending',
    producer: 'KtBeats',
    status: 'ALBUM',
    note: '白黒つかないページは混ざったまま、また明日へ。',
    artwork: `${siteBase}/best-bad-ending.webp`,
    hoverArtwork: `${siteBase}/best-bad-ending-hover.webp`,
  },
]

const compactTracklist = [
  '01. ボトルメール (Prod.bonnierogerr)',
  '02. GRIP (Prod. BOSTON MG)',
  '03. Fashion Villain',
  '04. No MoЯe Maze',
  '05. ヒトリゴト (Prod. by Anabolic Beatz)',
  '06. Reflect Room',
  '07. Scars to Skies (Prod. K4nji)',
  '08. Fallen feather (Prod. K4nji)',
  '09. Still Loading, Continue?',
  '10. Through My Words (Prod.Peril)',
  '11. Best Bad Ending',
]

const activityLinks: ActivityLink[] = [
  {
    label: 'X',
    href: 'https://x.com/kou__0117',
    icon: `${siteBase}/logo-x-black.png`,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@kou__0117',
    icon: `${siteBase}/logo-youtube.png`,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@kou_t_0117',
    icon: `${siteBase}/logo-tiktok.png`,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/odorisekou/',
    icon: `${siteBase}/logo-instagram.svg`,
  },
]

function FragmentArtwork({ track }: { track: Track }) {
  return (
    <div className="fragment-artwork" aria-label={`${track.title} fragment artwork`}>
      <span className="fragment-artwork-number">{track.no}</span>
      <strong>{track.displayTitle ?? track.title}</strong>
    </div>
  )
}

function YouTubePreview({
  track,
  videoId,
  isPlaying,
  onPlay,
}: {
  track: Track
  videoId: string
  isPlaying: boolean
  onPlay: () => void
}) {
  const title = `${track.title} - YouTube video`

  return (
    <div className="youtube-frame">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          className="youtube-preview"
          type="button"
          aria-label={`${track.title}のYouTube動画を再生`}
          onClick={onPlay}
        >
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="youtube-play" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function App() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [albumActionLabel, setAlbumActionLabel] = useState(() => getAlbumActionLabel())
  const [showFloatingAlbumLink, setShowFloatingAlbumLink] = useState(false)
  const heroSectionRef = useRef<HTMLElement | null>(null)
  const artworkStreamSectionRef = useRef<HTMLElement | null>(null)
  const artworkAutoScrollResumeRef = useRef(0)
  const artworkIntroFrameRef = useRef(0)
  const artworkIntroPlayedRef = useRef(false)
  const artworkIntroRunningRef = useRef(false)
  const artworkAutoScrollPlugin = useMemo(
    () =>
      AutoScroll({
        speed: 1,
        startDelay: 1200,
        direction: 'forward',
        playOnInit: false,
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  )
  const [artworkStreamRef, artworkStreamApi] = useEmblaCarousel(
    {
      align: 'center',
      loop: true,
      dragFree: true,
      skipSnaps: true,
    },
    [artworkAutoScrollPlugin],
  )

  useEffect(() => {
    const remaining = albumReleaseAtJst - Date.now()

    if (remaining <= 0) {
      return
    }

    const releaseTimer = window.setTimeout(() => {
      setAlbumActionLabel(getAlbumActionLabel())
    }, remaining)

    return () => {
      window.clearTimeout(releaseTimer)
    }
  }, [])

  const openTrackModal = useCallback((track: Track) => {
    setActiveVideoId(null)
    setSelectedTrack(track)
  }, [])

  const closeTrackModal = useCallback(() => {
    setActiveVideoId(null)
    setSelectedTrack(null)
  }, [])

  const moveTrackModal = useCallback((track: Track) => {
    setActiveVideoId(null)
    setSelectedTrack(track)
  }, [])

  useEffect(() => {
    const revealSections = Array.from(document.querySelectorAll<HTMLElement>('.reveal-section'))

    if (typeof IntersectionObserver === 'undefined') {
      revealSections.forEach((section) => section.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.08,
      },
    )

    revealSections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  const playArtworkStream = useCallback(
    (startDelay = 1200) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      artworkStreamApi?.plugins().autoScroll?.play(startDelay)
    },
    [artworkStreamApi],
  )

  const cancelArtworkIntro = useCallback(() => {
    window.cancelAnimationFrame(artworkIntroFrameRef.current)
    artworkIntroFrameRef.current = 0
    artworkIntroRunningRef.current = false
  }, [])

  const stopArtworkStream = useCallback(() => {
    window.clearTimeout(artworkAutoScrollResumeRef.current)
    cancelArtworkIntro()
    artworkStreamApi?.plugins().autoScroll?.stop()
  }, [artworkStreamApi, cancelArtworkIntro])

  const scheduleArtworkStreamResume = useCallback(() => {
    window.clearTimeout(artworkAutoScrollResumeRef.current)
    artworkAutoScrollResumeRef.current = window.setTimeout(() => {
      playArtworkStream(0)
    }, 1200)
  }, [playArtworkStream])

  const runArtworkIntro = useCallback(() => {
    if (!artworkStreamApi || artworkIntroPlayedRef.current) {
      playArtworkStream(0)
      return
    }

    artworkIntroPlayedRef.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const container = artworkStreamApi.containerNode()
    const containerStyles = window.getComputedStyle(container)
    const roundDistance =
      container.scrollWidth -
      Number.parseFloat(containerStyles.paddingLeft || '0') -
      Number.parseFloat(containerStyles.paddingRight || '0')

    if (!roundDistance) {
      playArtworkStream(0)
      return
    }

    const engine = artworkStreamApi.internalEngine()
    const duration = 5200
    const frameDuration = 1000 / 60
    const finalSpeedPerFrame = 1
    const easingPower = 2.2
    const frameCount = duration / frameDuration
    const averageSpeedPerFrame = roundDistance / frameCount
    const initialSpeedPerFrame =
      finalSpeedPerFrame + Math.max(0, averageSpeedPerFrame - finalSpeedPerFrame) * (easingPower + 1)
    let start = 0
    let previous = 0

    cancelArtworkIntro()
    artworkStreamApi.plugins().autoScroll?.stop()
    artworkIntroRunningRef.current = true

    const moveBy = (distance: number) => {
      engine.previousLocation.set(engine.location)
      engine.location.add(distance)
      engine.target.set(engine.location)
      engine.offsetLocation.set(engine.location)
      engine.scrollLooper.loop(Math.sign(distance))
      engine.slideLooper.loop()
      engine.translate.to(engine.offsetLocation.get())
    }

    const tick = (now: number) => {
      if (!artworkIntroRunningRef.current) {
        return
      }

      if (!start) {
        start = now
        previous = now
      }

      const elapsed = Math.min(now - start, duration)
      const deltaFrames = Math.max(0.5, (now - previous) / frameDuration)
      const progress = Math.min(1, elapsed / duration)
      const speedPerFrame =
        finalSpeedPerFrame + (initialSpeedPerFrame - finalSpeedPerFrame) * Math.pow(1 - progress, easingPower)
      const step = speedPerFrame * deltaFrames

      moveBy(-step)

      previous = now

      if (elapsed < duration) {
        artworkIntroFrameRef.current = window.requestAnimationFrame(tick)
        return
      }

      artworkIntroRunningRef.current = false
      playArtworkStream(0)
    }

    artworkIntroFrameRef.current = window.requestAnimationFrame(tick)
  }, [artworkStreamApi, cancelArtworkIntro, playArtworkStream])

  useEffect(() => {
    if (!artworkStreamApi) {
      return
    }

    const viewport = artworkStreamApi.rootNode()
    const section = artworkStreamSectionRef.current
    let introObserver: IntersectionObserver | null = null

    if (!('IntersectionObserver' in window) || !section) {
      runArtworkIntro()
    } else {
      introObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runArtworkIntro()
              introObserver?.disconnect()
            }
          })
        },
        {
          rootMargin: '0px 0px -12% 0px',
          threshold: 0.24,
        },
      )
      introObserver.observe(section)
    }

    const handleInteractionStart = () => {
      stopArtworkStream()
    }
    const handleInteractionEnd = () => {
      scheduleArtworkStreamResume()
    }
    const handleWheel = () => {
      stopArtworkStream()
      scheduleArtworkStreamResume()
    }

    viewport.addEventListener('pointerdown', handleInteractionStart)
    viewport.addEventListener('touchstart', handleInteractionStart, { passive: true })
    viewport.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('pointerup', handleInteractionEnd)
    window.addEventListener('pointercancel', handleInteractionEnd)
    window.addEventListener('touchend', handleInteractionEnd)
    window.addEventListener('touchcancel', handleInteractionEnd)

    return () => {
      window.clearTimeout(artworkAutoScrollResumeRef.current)
      cancelArtworkIntro()
      introObserver?.disconnect()
      viewport.removeEventListener('pointerdown', handleInteractionStart)
      viewport.removeEventListener('touchstart', handleInteractionStart)
      viewport.removeEventListener('wheel', handleWheel)
      window.removeEventListener('pointerup', handleInteractionEnd)
      window.removeEventListener('pointercancel', handleInteractionEnd)
      window.removeEventListener('touchend', handleInteractionEnd)
      window.removeEventListener('touchcancel', handleInteractionEnd)
      artworkStreamApi.plugins().autoScroll?.stop()
    }
  }, [
    artworkStreamApi,
    cancelArtworkIntro,
    runArtworkIntro,
    scheduleArtworkStreamResume,
    stopArtworkStream,
  ])

  useEffect(() => {
    const heroSection = heroSectionRef.current

    if (!heroSection) {
      setShowFloatingAlbumLink(false)
      return
    }

    const updateFloatingAlbumLink = (bottom: number) => {
      setShowFloatingAlbumLink(bottom <= 0)
    }

    updateFloatingAlbumLink(heroSection.getBoundingClientRect().bottom)

    if (!('IntersectionObserver' in window)) {
      const updateFromScroll = () => {
        updateFloatingAlbumLink(heroSection.getBoundingClientRect().bottom)
      }

      globalThis.addEventListener('scroll', updateFromScroll, { passive: true })
      globalThis.addEventListener('resize', updateFromScroll)

      return () => {
        globalThis.removeEventListener('scroll', updateFromScroll)
        globalThis.removeEventListener('resize', updateFromScroll)
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        updateFloatingAlbumLink(entry.boundingClientRect.bottom)
      })
    })

    observer.observe(heroSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!selectedTrack) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTrackModal()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeTrackModal, selectedTrack])

  return (
    <main>
      <section className="hero-section" aria-label="Fragments From Above" ref={heroSectionRef}>
        <div className="hero-image" aria-hidden="true">
          <img src={`${siteBase}/album-hero.webp`} alt="" fetchPriority="high" decoding="async" />
        </div>
        <header className="site-header">
          <a href="#comment" aria-label="Comment">
            Comment
          </a>
          <a href="#tracks" aria-label="Track list">
            Tracks
          </a>
          <a href="#links" aria-label="Links">
            Links
          </a>
        </header>
        <div className="hero-copy">
          <p className="kicker">1st ALBUM</p>
          <h1>Fragments From Above</h1>
          <p className="release-date">2026.07.10 Digital Release</p>
          <p className="lead">
            Everything here is a fragment from above - live with it.
          </p>
          <a className="album-link-button" href={albumLink} target="_blank" rel="noreferrer">
            {albumActionLabel}
          </a>
        </div>
      </section>

      <section
        id="fragments"
        className="artwork-stream-section reveal-section"
        aria-label="Artwork stream"
        ref={artworkStreamSectionRef}
      >
        <div className="artwork-stream-heading">
          <h2>Fragments</h2>
          <p>11 pieces from the album.</p>
        </div>
        <div className="artwork-stream-shell" ref={artworkStreamRef}>
          <div className="artwork-stream-track">
            {tracks.map((track, index) => (
              <div className="artwork-stream-slide" key={`${track.no}-${index}`}>
                <button
                  className="artwork-stream-item"
                  type="button"
                  aria-label={`${track.title}の詳細を開く`}
                  onClick={() => openTrackModal(track)}
                >
                  <img
                    src={track.hoverArtwork ?? track.artwork}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="artwork-stream-number">{track.no}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comment" className="comment-section reveal-section">
        <div className="section-label">Artist Comment</div>
        <div className="comment-copy">
          <p>踊瀬コウです。</p>
          <p>
            1st アルバム Fragments From Above をリリースします。
            シングルも含めて約8ヶ月、本格的なアルバム構想から考えると約半年間の制作を経て完成した11曲です。
            1枚を通してのストーリー作品でありつつも、それぞれの楽曲を&quot;Fragments&quot;として一つ一つの世界として描き、
            自分が何者なのかを定義する作品としてアルバムの作成を進めました。
          </p>
          <p>書き手のストーリーでもあり、同時に11個のこの世界にいる誰かの物語でもあります。</p>
          <p>ぜひリリックと音、アートワークと色んな面でアルバムを楽しんでいただければ嬉しいです！</p>
        </div>
      </section>

      <section id="tracks" className="tracks-section reveal-section">
        <div className="section-intro">
          <div className="section-label">Tracklist & Credits</div>
        </div>
        <div className="track-list">
          {tracks.map((track) => {
            const cardStyle = track.artwork
              ? ({ '--track-hover-artwork': `url(${track.hoverArtwork ?? track.artwork})` } as CSSProperties)
              : undefined

            return (
              <article
                className={`track-card ${track.artwork ? 'artwork-track' : 'fragment-track'} ${track.no === '09' ? 'long-title-track' : ''}`}
                key={track.no}
                role="button"
                tabIndex={0}
                style={cardStyle}
                onClick={() => openTrackModal(track)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openTrackModal(track)
                  }
                }}
              >
                <span className="track-number">{track.no}.</span>
                <h3>{track.title}</h3>
                <div className="credit">PROD. {track.producer}</div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="links" className="links-section reveal-section">
        <div className="links-copy">
          <h2>RELEASE SHEET</h2>
          <div className="release-sheet-artist">ODORISE KOU</div>
          <div className="follow-block">
            <span>FOLLOW</span>
            <div className="activity-links">
              {activityLinks.map((link) => (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.label} aria-label={link.label}>
                  <img src={link.icon} alt="" />
                </a>
              ))}
            </div>
          </div>
          <p className="release-sheet-statement">
            Everything here is a fragment from above &mdash; live with it.
          </p>
        </div>
        <div className="album-summary" aria-label="Album summary">
          <img src={`${siteBase}/album-cover.webp`} alt="Fragments From Above album artwork" />
          <span>Fragments From Above</span>
          <h3>2026.07.10 Release</h3>
          <ol>
            {compactTracklist.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ol>
        </div>
      </section>
      <a
        className={`floating-album-link ${showFloatingAlbumLink ? 'is-visible' : ''}`}
        href={albumLink}
        target="_blank"
        rel="noreferrer"
        aria-hidden={!showFloatingAlbumLink}
        tabIndex={showFloatingAlbumLink ? undefined : -1}
      >
        {albumActionLabel}
      </a>
      {selectedTrack ? (
        (() => {
          const selectedTrackIndex = tracks.findIndex((track) => track.no === selectedTrack.no)
          const previousTrack = tracks[(selectedTrackIndex - 1 + tracks.length) % tracks.length]
          const nextTrack = tracks[(selectedTrackIndex + 1) % tracks.length]
          const selectedYoutubeId = getYouTubeId(selectedTrack.href)

          return (
            <div
              className="track-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="track-modal-title"
              onClick={closeTrackModal}
            >
              <div className="track-modal-shell" onClick={(event) => event.stopPropagation()}>
                <div className="track-modal-panel">
                  <button className="modal-close" type="button" aria-label="Close" onClick={closeTrackModal}>
                    &times;
                  </button>
                  <div className="modal-artwork">
                    {selectedTrack.artwork ? (
                      <img src={selectedTrack.artwork} alt={`${selectedTrack.title} artwork`} />
                    ) : (
                      <FragmentArtwork track={selectedTrack} />
                    )}
                  </div>
                  <div className="modal-copy">
                    <span className="modal-kicker">
                      {selectedTrack.no} / {selectedTrack.status}
                    </span>
                    <h2 id="track-modal-title">{selectedTrack.displayTitle ?? selectedTrack.title}</h2>
                    <p>{selectedTrack.note}</p>
                    {selectedYoutubeId ? (
                      <YouTubePreview
                        track={selectedTrack}
                        videoId={selectedYoutubeId}
                        isPlaying={activeVideoId === selectedYoutubeId}
                        onPlay={() => setActiveVideoId(selectedYoutubeId)}
                      />
                    ) : null}
                    <dl>
                      {selectedTrack.release ? (
                        <div>
                          <dt>Release</dt>
                          <dd>{selectedTrack.release}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Producer</dt>
                        <dd>{selectedTrack.producer}</dd>
                      </div>
                      <div>
                        <dt>Lyric</dt>
                        <dd>ODORISE KOU</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="modal-track-nav" aria-label="Track navigation">
                  <button type="button" onClick={() => moveTrackModal(previousTrack)}>
                    <span aria-hidden="true">&larr;</span>
                    <span>
                      {previousTrack.no} {previousTrack.title}
                    </span>
                  </button>
                  <button type="button" onClick={() => moveTrackModal(nextTrack)}>
                    <span>
                      {nextTrack.no} {nextTrack.title}
                    </span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })()
      ) : null}
    </main>
  )
}

export default App
