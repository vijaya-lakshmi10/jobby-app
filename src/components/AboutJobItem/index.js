import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import SimilarJobItem from '../SimilarJobItem'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDataDetails: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        employmentType: eachJob.employment_type,
        companyWebsiteUrl: eachJob.company_website_url,
        lifeAtCompany: {
          description: eachJob.description,
          imageUrl: eachJob.image_url,
        },
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        packagrPerAnnum: eachJob.package_per_annum,
        skills: eachJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }))
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(eachItem => ({
        id: eachItem.id,
        title: eachItem.title,
        rating: eachItem.rating,
        location: eachItem.location,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        companyLogoUrl: eachItem.company_logo_url,
      }))
      this.setState({
        jobDataDetails: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  displaySuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        id,
        jobDescription,
        rating,
        skills,
        location,
        title,
        companyWebsiteUrl,
        employmentType,
        lifeAtCompany,
        packagrPerAnnum,
      } = jobDataDetails[0]
      return (
        <>
          <div className="job-item-container">
            <div className="first-container">
              <div className="title-and-image-container">
                <img
                  src={companyLogoUrl}
                  className="logo"
                  alt="job details company logo"
                />
                <div className="title-and-rating-container">
                  <h1 className="title-heading">{title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-and-package-container">
                <div className="job-type-container">
                  <div className="location-icon-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="employment-type-container">
                    <p className="employment-type">{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{packagrPerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="horizontal-line" />
            <div className="second-container">
              <div className="description-container">
                <h1 className="description-heading">Description</h1>
                <a className="description-link" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="desc">{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="job-details">
              {skills.map(eachSkill => (
                <li className="job-details-list" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-img"
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="company-life-container">
              <div className="life-at-company">
                <h1>Life At Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsData.map(eachItem => (
              <SimilarJobItem
                key={eachItem.id}
                similarJobData={eachItem}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  retryJobDetailsAgain = () => {
    this.getJobData()
  }

  displayFailureView = () => (
    <div className="job-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="retry-btn-container">
        <button
          type="button"
          className="retry-btn"
          onClick={this.retryJobDetailsAgain}
        >
          retry
        </button>
      </div>
    </div>
  )

  displayLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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
        <div className="job-details-view-container">
          {this.displayJobDetails()}
        </div>
      </>
    )
  }
}
export default AboutJobItem
