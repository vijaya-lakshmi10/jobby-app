import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import {AiOutlineSearch} from 'react-icons/ai'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and Above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and Above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and Above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and Above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
    profileData: [],
    jobsData: [],
    radioInput: '',
    searchInput: '',
    checkBoxInputs: [],
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobsData()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkBoxInputs, radioInput, searchInput} = this.state
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const responseProfile = await fetch(profileApiUrl, optionsProfile)
    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        apiStatus: apiStatusConstants.success,
        responseSuccess: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    const {checkBoxInputs, radioInput, searchInput} = this.state
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
        packagePerAnnum: eachItem.package_per_annum,
        employmentType: eachItem.employment_type,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  radioButtonInputs = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  getCheckBoxInputs = event => {
    const {checkBoxInputs} = this.state
    const inputsCheck = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputsCheck.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filterData = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({checkBoxInputs: filterData}),
        this.getJobsData,
      )
    }
  }

  onClickRetryProfile = () => {
    this.getProfileDetails()
  }

  onClickRetryJobs = () => {
    this.getJobsData()
  }

  displayProfileSuccessView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-img" />
          <h1 className="profile-heading">{name}</h1>
          <p className="profile-desc">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  displayProfileFailureView = () => (
    <div className="failure-view-container">
      <button
        type="button"
        className="failure-btn"
        onClick={this.onClickRetryProfile}
      >
        retry
      </button>
    </div>
  )

  displayProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayProfileDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displayProfileSuccessView()
      case apiStatusConstants.failure:
        return this.displayProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.displayProfileLoadingView()
      default:
        return null
    }
  }

  displayJobsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        we cannot seem to find the page you are looking for.
      </p>
      <div className="failure-btn-container">
        <button
          type="button"
          className="failure-btn"
          onClick={this.onClickRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  displayJobsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayJobsSuccessView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="jobs-data-list">
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  displayJobsView = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.displayJobsSuccessView()
      case apiJobStatusConstants.failure:
        return this.displayJobsFailureView()
      case apiJobStatus.inProgress:
        return this.displayJobsLoadingView()
      default:
        return null
    }
  }

  getCheckBoxView = () => (
    <ul className="checkboxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="list-items" key={eachItem.employmentTypeId}>
          <input
            className="input-text"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.getCheckBoxInputs}
          />
          <label className="label-text" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getRadioButtonInputsView = () => (
    <ul className="radio-btn-container">
      {salaryRangesList.map(eachItem => (
        <li className="list-items" key={eachItem.salaryRangeId}>
          <input
            className="radio-input-text"
            id={eachItem.salaryRangeId}
            type="radio"
            onChange={this.radioButtonInputs}
            name="option"
          />
          <label className="label-text" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  submitSearchInput = () => {
    this.getJobsData()
  }

  enterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  render() {
    const {searchInput, checkBoxInputs, radioInput} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-container">
            {this.displayProfileDetails()}
            <hr className="hr-line" />
            <h1 className="heading">Type of Employment</h1>
            {this.getCheckBoxView()}
            <hr className="hr-line" />
            <h1 className="heading">Salary Range</h1>
            {this.getRadioButtonInputsView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.getSearchInput}
                onKeyDown={this.enterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.submitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.displayJobsView()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
