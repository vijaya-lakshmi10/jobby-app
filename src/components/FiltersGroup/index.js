import './index.css'
import {BsSearch} from 'react-icons/bs'
import ProfileDetails from '../ProfileDetails'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const displaySearchInput = () => {
    const {getJobs, searchInput} = props
    return (
      <div className="search-input-container">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button
          type="button"
          id="searchButton"
          onClick={getJobs}
          className="search-btn"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  const displayTypeOfEmployment = () => {
    const {employmentTypesList} = props
    return (
      <div className="type-of-employment-container">
        <h1 className="employment-type-heading">Type of Employment</h1>
        <ul className="employment-type-list">
          {employmentTypesList.map(eachEmployee => {
            const {changeEmployeesList} = props
            const onSelectEmployee = event => {
              changeEmployeesList(event.target.value)
            }
            return (
              <li
                className="employee-list-item"
                key={eachEmployee.id}
                onChange={onSelectEmployee}
              >
                <input
                  type="checkbox"
                  value={eachEmployee.employmentTypeId}
                  id={eachEmployee.employmentTypeId}
                  className="check-input"
                />
                <label
                  className="check-label"
                  htmlFor={eachEmployee.employmentTypeId}
                >
                  {eachEmployee.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const displaySalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div className="salary-range-container">
        <h1 className="salary-range-heading">Salary Range</h1>
        <ul className="salary-range-list">
          {salaryRangesList.map(eachSalary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachSalary.salaryRangeId)
            }
            return (
              <li
                className="salary-list"
                key={eachSalary.salaryRangeId}
                onClick={onClickSalary}
              >
                <input
                  type="radio"
                  id={eachSalary.salaryRangeId}
                  name="salary"
                  className="check-input"
                />
                <label
                  className="check-label"
                  htmlFor={eachSalary.salaryRangeId}
                >
                  {eachSalary.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="filters-group-container">
      {displaySearchInput()}
      <ProfileDetails />
      <hr className="horizontal-line" />
      {displayTypeOfEmployment()}
      <hr className="horizontal-line" />
      {displaySalaryRange()}
    </div>
  )
}
export default FiltersGroup
