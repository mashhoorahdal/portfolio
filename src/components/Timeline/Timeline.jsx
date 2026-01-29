import { experiences } from '../../portfolio'
import './Timeline.css'

const Timeline = () => {
  if (!experiences.length) return null

  return (
    <section className='section timeline' id='timeline'>
      <h2 className='section__title'>Experience & Education</h2>
      <div className='timeline__container'>
        {experiences.map((exp, index) => (
          <div key={index} className='timeline__item'>
            <div className='timeline__content'>
              <span className='timeline__date'>{exp.date}</span>
              <h3 className='timeline__title'>{exp.title}</h3>
              <p className='timeline__company'>{exp.company}</p>
              <p className='timeline__desc'>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timeline