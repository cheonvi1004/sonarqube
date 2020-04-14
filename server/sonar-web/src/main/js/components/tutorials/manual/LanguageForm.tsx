/*
 * SonarQube
 * Copyright (C) 2009-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import RadioToggle from 'sonar-ui-common/components/controls/RadioToggle';
import { translate } from 'sonar-ui-common/helpers/l10n';
import RenderOptions from '../components/RenderOptions';
import { LanguageConfig } from '../types';
import { isLanguageConfigured } from '../utils';

interface Props {
  component: T.Component;
  config?: LanguageConfig;
  onDone: (config: LanguageConfig) => void;
  onReset: VoidFunction;
  organization?: string;
}

type State = LanguageConfig;

export interface RenderOSProps {
  os: string | undefined;
  setOS: (os: string) => void;
}

export function RenderOS(props: RenderOSProps) {
  return (
    <RenderOptions
      checked={props.os}
      name="os"
      onCheck={props.setOS}
      optionLabelKey="onboarding.language.os"
      options={['linux', 'win', 'mac']}
      titleLabelKey="onboarding.language.os"
    />
  );
}

export default class LanguageForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...(this.props.config || {}),
      projectKey: props.component ? props.component.key : undefined
    };
  }

  handleChange = () => {
    if (isLanguageConfigured(this.state)) {
      this.props.onDone(this.state);
    } else {
      this.props.onReset();
    }
  };

  handleLanguageChange = (language: string) => {
    this.setState({ language }, this.handleChange);
  };

  handleJavaBuildChange = (javaBuild: string) => {
    this.setState({ javaBuild }, this.handleChange);
  };

  handleOSChange = (os: string) => {
    this.setState({ os }, this.handleChange);
  };

  renderJavaBuild = () => (
    <RenderOptions
      checked={this.state.javaBuild}
      name="java-build"
      onCheck={this.handleJavaBuildChange}
      optionLabelKey="onboarding.language.java.build_technology"
      options={['maven', 'gradle']}
      titleLabelKey="onboarding.language.java.build_technology"
    />
  );

  render() {
    const { language } = this.state;
    const languages = ['java', 'dotnet', 'other'];

    return (
      <>
        <div>
          <h4 className="spacer-bottom">{translate('onboarding.language')}</h4>
          <RadioToggle
            name="language"
            onCheck={this.handleLanguageChange}
            options={languages.map(language => ({
              label: translate('onboarding.language', language),
              value: language
            }))}
            value={language}
          />
        </div>
        {language === 'java' && this.renderJavaBuild()}
        {language === 'other' && <RenderOS os={this.state.os} setOS={this.handleOSChange} />}
      </>
    );
  }
}