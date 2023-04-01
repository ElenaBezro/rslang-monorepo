import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LevelSelection } from '~/components/game'
import { Path } from '~/components/router'

// TODO: maybe somehow combine that with sprintlevelselection component?
function AudiocallLevelSelect() {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const onLevelSelected = (group: number) => navigate(`${Path.AUDIOCALL}/${group}`)

	const controls = [t('AUDIOCALL.CONTROLS_1'), t('AUDIOCALL.CONTROLS_2'), t('AUDIOCALL.CONTROLS_3'), t('AUDIOCALL.CONTROLS_4')]

	return <LevelSelection title={t('AUDIOCALL.TITLE')} description={t('AUDIOCALL.DESCRIPTION')} onLevelSelected={onLevelSelected} controls={controls} type="audiocall" />
}

export default AudiocallLevelSelect
