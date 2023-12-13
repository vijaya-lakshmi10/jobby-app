import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import './index.css'
import SimilarJobItem from '../SimilarJobItem'
import SkillsCard from '../SkillsCard'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItem extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getSimilarJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    companyWebsiteUrl: data.company_website_url,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimilarJob =>
        this.getSimilarJobData(eachSimilarJob),
      )
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  displayFailureView = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div className="job-item-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="job-item-failure-heading">Oops! Something Went Wrong</h1>
        <p className="job-item-desc">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="retry-btn"
          type="button"
          id="button"
          onClick={this.getJobData}
        >
          Retry
        </button>
      </div>
    )
  }

  displayLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displaySuccessView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      employmentType,
      companyWebsiteUrl,
      jobDescription,
      lifeAtCompany,
      location,
      rating,
      title,
      packagePerAnnum,
      skills,
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-item-container">
        <div className="job-item-details">
          <div className="logo-location-container">
            <div className="logo-title-container">
              <img
                src={companyLogoUrl}
                className="company-logo"
                alt="job details company logo"
              />
              <div className="title-rating-container">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
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
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-link-container">
              <a href={companyWebsiteUrl} className="visit-link">
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <SkillsCard skillsDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life At Company</h1>
          <div className="description-image-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem
              jobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }
  displayJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displaySuccessView()
      case apiStatusConstants.failure:
        return this.displayFailureView()
      case apiStatusConstants.inProgress:
        return this.displayLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.displayJobDetails()}
        </div>
      </>
    )
  }
}
export default JobItem
