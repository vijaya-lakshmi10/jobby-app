import {MdLocationOn} from 'react-icons/md'
import './index.css'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'

const SimilarJobItem = props => {

  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  
  return (
    <li className="similar-job-item-list">
      <div className="location-logo-title-container">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="similar job company logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="rating-icon" />
              <p className="rating-desc">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="description-heading">Description</h1>
        <p className="desc">{jobDescription}</p>
        <div className="location-employee-container">
          <div className="location-container">
            <MdLocationOn className="location-icon" />
            <p className="location">{location}</p>
          </div>
          <div className="employment-type-container">
            <BsFillBriefcaseFill className="briefcase-icon" />
            <p className="employment-type">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobItem
