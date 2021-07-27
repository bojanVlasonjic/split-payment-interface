package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.PaymentSplitDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.mappers.AccountMapper;
import dipl.spi.spi_backend.mappers.PaymentSplitMapper;
import dipl.spi.spi_backend.model.Account;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.model.PaymentSplit;
import dipl.spi.spi_backend.repository.PaymentSplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentSplitService {

    @Autowired
    private PaymentSplitRepository paymentSplitRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private AppUserService appUserService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private PaymentSplitMapper paymentSplitMapper;

    @Autowired
    private AccountMapper accountMapper;


    public List<PaymentSplitDto> getPaymentSplitsForArticle(Long articleId) {
        return paymentSplitRepository
                .findByArticleId(articleId)
                .stream()
                .map(ps -> paymentSplitMapper.paymentSplitToPaymentSplitDto(ps))
                .collect(Collectors.toList());
    }

    public PaymentSplitDto createPaymentSplit(PaymentSplitDto paymentSplitDto) {

        if(paymentSplitRepository
                .findByArticleIdAndAccountNumber(
                        paymentSplitDto.getArticleId(),
                        paymentSplitDto.getAccount().getNumber()
                )
                .isPresent()
        ) {
            throw new ApiBadRequestException("Payment split with account number "
                    + paymentSplitDto.getAccount().getNumber() + " has already been added to the article");
        }

        Article article = articleService.findById(paymentSplitDto.getArticleId());
        AppUser user = appUserService.findUserById(article.getUser().getId());
        Account account = null;

        // check if the account has already been saved or the user selected an existing one
        Optional<Account> accountOpt = accountService.findAccountById(paymentSplitDto.getAccount().getId());
        account = accountOpt.orElseGet(() ->
                accountMapper.accountDtoToAccount(paymentSplitDto.getAccount(), user)
        );

        PaymentSplit paymentSplit = paymentSplitMapper.paymentSplitDtoToPaymentSplit(paymentSplitDto,
                article, account);

        try {
            paymentSplitRepository.save(paymentSplit);
            return paymentSplitMapper.paymentSplitToPaymentSplitDto(paymentSplit);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        throw new ApiBadRequestException("Something went wrong. Please refresh the page and try again");
    }

    public PaymentSplitDto updatePaymentSplit(PaymentSplitDto paymentSplitDto) {

        if (paymentSplitDto.getId() == null) {
           throw new ApiBadRequestException("Failed to find payment split");
        }

        PaymentSplit paymentSplit = paymentSplitRepository
                .findById(paymentSplitDto.getId())
                .orElseThrow(() -> new ApiNotFoundException("Payment split with id "
                        + paymentSplitDto.getId() + " wasn't found"));

        paymentSplit.updateValues(paymentSplitDto);

        try {
            paymentSplitRepository.save(paymentSplit);
            return paymentSplitMapper.paymentSplitToPaymentSplitDto(paymentSplit);
        } catch (Exception ex) {
            throw new ApiBadRequestException("Something went wrong. Please refresh the page and try again");
        }

    }


    public boolean deletePaymentSplit(Long splitId) {

        Optional<PaymentSplit> paySplitOpt = paymentSplitRepository.findById(splitId);

        if(paySplitOpt.isEmpty()) {
            throw new ApiNotFoundException("Failed to find payment split with id " + splitId);
        }

        try {
            paymentSplitRepository.delete(paySplitOpt.get());
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ApiBadRequestException("Something went wrong while deleting the payment split. " +
                    "Please refresh the page and try again.");
        }

        return true;
    }


}