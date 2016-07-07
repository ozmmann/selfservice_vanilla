<?php

    use yii\helpers\Html;

    /* @var $locationForm app\models\forms\LocationForm */

    $user = \app\models\User::findOne(Yii::$app->user->id);
?>
<div class="row">
    <a href="#" class="row-title">Укажите место проведения</a>
    <div class="row-content">
        <?php
            $locations_count = count($locationForm->address);
            if($locations_count == 0){
                $locations_count = 1;
            }
            for($i = 0; $i < $locations_count; $i++): ?>
                <div id="locations_<?= $i ?>" data-locations-count="<?= $locations_count + 1 ?>">
                    <div class="address-row">
                        <div class="required-field">
                            <?= Html::textInput('LocationForm[address][]', $locationForm->address[$i], [
                                'class'       => 'w-100 address',
                                'placeholder' => 'ул. Парашютная 12/14 1',
                                'id'          => 'address'
                            ]) ?>
                            <div class="form-error-msg f-14"></div>
                        </div>
                        <div class="f-0 mtop-20">
                            <div class="dib w-50 f-14">
                                <?= Html::textInput('LocationForm[city][]', $locationForm->city[$i], [
                                    'class'       => 'w-85 city',
                                    'placeholder' => 'Киев',
                                ]) ?>
                            </div>
                            <div class="dib w-50 f-14 text-right">
                                <?= Html::textInput('LocationForm[phone][]', $locationForm->phone[$i], [
                                    'class'       => 'w-100 phone',
                                    'placeholder' => '+380 (ХХ) ХХХ-ХХ-ХХ',
                                    'pattern'     => '/^(\+?38\s?|)(|\()[0-9]{3}(|\))\s?(|\-)[0-9]{3}\s?(|\-)[0-9]{2}\s?(|\-)[0-9]{2}$/'
                                ]) ?>
                            </div>
                        </div>
                    </div>

                    <div class="db text-center mtop-50">
                        <button type="button" id="addlocation" class="btn btn-white-blue-border btn-add">Добавить локацию</button>
                    </div>
                </div>
            <?php endfor; ?>
        <div class="db mtop-40 text-right">
            <button class="btn btn-yellow btn-next-step">Дальше</button>
        </div>
    </div>


</div>
