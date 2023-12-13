import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard'
import './index.css'

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
    label: '10 LPA and above',
    salaryRangeId: '1000000',
  },
  {
    label: '20 LPA and above',
    salaryRangeId: '2000000',
  },
  {
    label: '30 LPA and above',
    salaryRangeId: '3000000',
  },
  {
    label: '40 LPA and above',
    salaryRangeId: '4000000',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    minSalary: 0,
    apiStatus: apiStatusConstants.initial,
    employeeType: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {minSalary, employeeType, searchInput} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join()}&minimum_package=${minSalary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        packagePerAnnum: eachJob.package_per_annum,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsList: updatedJobsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  displayJobs = () => {
    const {jobsList} = this.state
    const jobsListLength = jobsList.length > 0
    return jobsListLength ? (
      <div className="all-jobs">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobCard key={job.id} jobData={job} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  displayFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="jobs-failure-btn"
        type="button"
        data-testid="button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  displayLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displayJobs()
      case apiStatusConstants.failure:
        return this.displayFailureView()
      case apiStatusConstants.inProgress:
        return this.displayLoadingView()
      default:
        return null
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  changeSalary = salary => {
    this.setState({minSalary: salary}, this.getJobs)
  }

  changeEmploymentType = type => {
    this.setState(
      prev => ({employeeType: [...prev.employeeType, type]}),
      this.getJobs,
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="sub-container">
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSalary={this.changeSalary}
              changeEmploymentType={this.changeEmploymentType}
              getJobs={this.getJobs}
              changeSearchInput={this.changeSearchInput}
              searchInput={searchInput}
            />
            <div className="search-input-jobs-list-container">
              <div className="search-input-container">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  onChange={this.changeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  onClick={this.getJobs}
                  className="search-button"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.displayAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
