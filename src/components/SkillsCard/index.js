const SkilsCard = props => {
  const {skillsDetails} = props
  const {imageUrl, name} = skillsDetails
  return (
    <li className="skills-item-list">
      <div className="skills-container">
        <img src={imageUrl} alt={name} className="skills-img" />
        <p className="skill-name">{name}</p>
      </div>
    </li>
  )
}
export default SkilsCard
